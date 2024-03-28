import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Row, Col, Card, Statistic, Input } from 'antd';

const { Search } = Input;

const finApiKey = process.env.REACT_APP_FINANCE_APIKEY;
const currencyList = ['EUR', 'JPY', 'GBP', 'AUD', 'CAD', 'CHF', 'IDR', 'SGD', 'MYR', 'CNY', 'HKD','KRW'];

const Forex = ({ simplified }) => {
  const count = simplified ? 6 : currencyList.length; 
  const [closingRate, setClosingRate] = useState({});
  const [loading, setLoading] = useState(true);
  const [searchValue, setSearchValue] = useState('');
  const [searchResult, setSearchResult] = useState(null);

  useEffect(() => {
    const fetchClosingRates = async () => {
      try {
        const requests = currencyList.map(currency => axios.get(`https://www.alphavantage.co/query?function=CURRENCY_EXCHANGE_RATE&from_currency=USD&to_currency=${currency}&apikey=${finApiKey}`));
        const responses = await Promise.all(requests);
        
        const rates = {};
        responses.forEach((response, index) => {
          const data = response.data['Realtime Currency Exchange Rate'];
          const rate = parseFloat(data['5. Exchange Rate']);
          rates[currencyList[index]] = rate;
        });

        setClosingRate(rates);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching currency rates:', error);
        setLoading(false);
      }
    };

    fetchClosingRates();
  }, []);

  const handleSearch = () => {
    const result = closingRate[searchValue.toUpperCase()];
    setSearchResult(result || 'N/A');
  };

  return (
    <div>
    {!simplified && (
      <Row justify="center" style={{ marginBottom: 16 }}>
        <Col>
          <Search
            placeholder="Enter currency code"
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
          <Card title={`${searchValue.toUpperCase()} to USD`}>
            <Statistic title="Rate" value={loading ? 'Loading...' : searchResult} />
          </Card>
        </Col>
      )}
      {!searchResult && currencyList.slice(0, count).map((currency, index) => (
        <Col key={index} span={8}>
          <Card title={`${currency} to USD`}>
            <Statistic title="Rate" value={loading ? 'Loading...' : closingRate[currency] || 'N/A'} />
          </Card>
        </Col>
      ))}
    </Row>
  </div>
);
};

export default Forex;
