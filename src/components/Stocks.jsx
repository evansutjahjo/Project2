import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Row, Col, Card, Statistic, Input,message } from 'antd';
import { PushpinOutlined } from '@ant-design/icons';

const { Search } = Input;

const finApiKey = process.env.REACT_APP_FINANCE_APIKEY;
const stockList = ['AAPL', 'AMZN', 'META', 'MSFT', 'GTLB', 'NVDA', 'DDOG', 'FTNT', 'ASML', 'AMD', 'AMAT', 'INTC'];

const Stocks = ({ simplified, watchStocks }) => {
  const [stocks, setStocks] = useState([]); 
  const count = simplified ? 6 : stockList.length; 
  const [closingPrice, setClosingPrice] = useState({});
  const [loading, setLoading] = useState(true);
  const [searchValue, setSearchValue] = useState('');
  const [searchResult, setSearchResult] = useState(null);

  const watchStocksArray = [];
  useEffect(() => {
    const fetchClosingPrice = async () => {
      try {
        const requests = stockList.map(stock => axios.get(`https://www.alphavantage.co/query?function=TIME_SERIES_DAILY&symbol=${stock}&apikey=${finApiKey}`));
        const responses = await Promise.all(requests);
        
        const price = {};

        responses.forEach((response, index) => {
          const data = response.data['Time Series (Daily)'];
          if (data) {
            const latestDate = Object.keys(data)[0];
            const closePrice = parseFloat(data[latestDate]['4. close']); 
            price[stockList[index]] = closePrice;
          }
        });

        setClosingPrice(price);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching Stock Price:', error);
        setLoading(false);
      }
    };

    fetchClosingPrice();
  }, []);

  const handleSearch = () => {
    const result = closingPrice[searchValue.toUpperCase()];
    setSearchResult(result !== undefined ? result : 'N/A');
  };  

  const handleAddToWatchlist = async (ticker) => {
    try {
      const airtableUrl = "https://api.airtable.com/v0/appGUUc6WOMDXQ9Xa/Table%201";
      const bearerToken = `Bearer ${process.env.REACT_APP_AIRTABLE_TOKEN}`;
      
      const closingPriceValue = (closingPrice[ticker] || 'N/A').toString(); 
      const data = {
        records: [
          {
            fields: {Ticker: ticker, Price: closingPriceValue}
          },
        ],
      };
  
      const response = await axios.post(airtableUrl, data, {
        headers: {
          Authorization: bearerToken,
        },
      });
  
      if (response.status === 200 || response.status === 201) {
        message.success(`${ticker} added to watchlist`);
        setStocks(prevStocks => [...prevStocks, { ticker, price: closingPriceValue }]);
      } else {
        message.error('Failed to add to watchlist');
      }
      
    } catch (error) {
      console.error('Error adding to watchlist:', error);
      console.log('Error details:', error.response.data);
      message.error('Failed to add to watchlist');
    }
  };
  
  
  return (
    <div>
      {!simplified && (
        <Row justify="center" style={{ marginBottom: 16 }}>
          <Col>
            <Search
              placeholder="Enter stock ticker"
              enterButton="Search"
              size="large"
              onSearch={handleSearch}
              onChange={e => setSearchValue(e.target.value)}
              style={{ width: 300 }}
            />
          </Col>
        </Row>
      )}
      <Row gutter={[16, 16]}>
        {searchResult !== null && (
          <Col span={24}>
            <Card title={`${searchValue.toUpperCase()}`}>
              <Statistic title="Price" value={loading ? 'Loading...' : searchResult} />
            </Card>
          </Col>
        )}
        {!searchResult && stockList.slice(0, count).map((ticker, index) => (
          <Col key={index} span={8}>
            <Card title={`${ticker}`} extra={
                <PushpinOutlined
                  style={{ fontSize: 24, cursor: 'pointer' }}
                  onClick={() => handleAddToWatchlist(ticker)}
                />
              }>
              <Statistic title="Price" value={loading ? 'Loading...' : closingPrice[ticker] || 'N/A'} />
            </Card>
          </Col>
        ))}
      </Row>
    </div>
  );
}

export default Stocks;
