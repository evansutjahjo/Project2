import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Row, Col, Card, Statistic, Input } from 'antd';

const { Search } = Input;

const finApiKey = process.env.REACT_APP_FINANCE_APIKEY;
const cryptoList = ['BTC','BNB', 'SOL', 'XRP','DOGE', 'ADA','SHIB', 'DOT', 'LINK', 'MATIC', 'TRX', 'UNI'];

const cryptoFullNameMap = {
  'BTC': 'Bitcoin',
  'BNB': 'Binance Coin',
  'SOL': 'Solana',
  'XRP': 'Ripple',
  'DOGE': 'Dogecoin',
  'ADA': 'Cardano',
  'SHIB': 'Shiba Inu',
  'DOT': 'Polkadot',
  'LINK': 'Chainlink',
  'MATIC': 'Polygon',
  'TRX': 'TRON',
  'UNI': 'Uniswap'
};

const Cryptocurrencies = ({ simplified }) => {
  const count = simplified ? 6 : cryptoList.length; 
  const [closingPrice, setClosingPrice] = useState({});
  const [loading, setLoading] = useState(true);
  const [searchValue, setSearchValue] = useState('');
  const [searchResult, setSearchResult] = useState(null);

  useEffect(() => {
    const fetchClosingPrice = async () => {
      try {
          const requests = cryptoList.map(crypto => axios.get(`https://www.alphavantage.co/query?function=DIGITAL_CURRENCY_DAILY&symbol=${crypto}&market=USD&apikey=${finApiKey}`));
          const responses = await Promise.all(requests);
          
          const price = {};

          responses.forEach((response, index) => {
            const data = response.data['Time Series (Digital Currency Daily)'];
            if (data) {
              const latestDate = Object.keys(data)[0];
              const closePrice = parseFloat(data[latestDate]['4b. close (USD)']); 
              price[cryptoList[index]] = closePrice;
            }
          });
          

        setClosingPrice(price);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching Crypto Price:', error);
        setLoading(false);
      }
    };

    fetchClosingPrice();
  }, []);

  const handleSearch = () => {
    const result = closingPrice[searchValue.toUpperCase()];
    setSearchResult(result !== undefined ? result : 'N/A');
  };  

  return (
    <div>
    {!simplified && (
      <Row justify="center" style={{ marginBottom: 16 }}>
        <Col>
          <Search
            placeholder="Enter Crypto Ticker"
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
    {!searchResult && cryptoList.slice(0, count).map((crypto, index) => (
  <Col key={index} span={8}>
    <Card title={`${cryptoFullNameMap[crypto]}`}>
      <Statistic title="Rate" value={loading ? 'Loading...' : closingPrice[crypto] || 'N/A'} />
    </Card>
  </Col>
))}
{searchResult !== null && (
  <Col span={8}>
    <Card title={`${cryptoFullNameMap[searchValue.toUpperCase()]}`}>
      <Statistic title="Rate" value={loading ? 'Loading...' : searchResult} />
    </Card>
  </Col>
)}

    </Row>
  </div>
  )
}

export default Cryptocurrencies;
