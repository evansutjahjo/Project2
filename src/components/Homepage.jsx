import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Typography, Row, Col, Statistic } from 'antd';
import { Link } from 'react-router-dom';
import News from './News';
import Forex from './Forex';
import Cryptocurrencies from './Cryptocurrencies';
import Stocks from './Stocks';

const { Title } = Typography;

const finApiKey = process.env.REACT_APP_FINANCE_APIKEY;
const stockSymbols = ['QQQ', 'SPY', 'DIA'];
const stockTitles = ['Nasdaq (QQQ)', 'S&P 500 (SPY)', 'Dow Jones (DIA)'];
const priceUrl = (symbol) => `https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=${symbol}&apikey=${finApiKey}`;

const Homepage = () => {
  const [stockPrices, setStockPrices] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStockPrices = async () => {
      try {
        const requests = stockSymbols.map(symbol => axios.get(priceUrl(symbol)));
        const responses = await Promise.all(requests);
        console.log('responses:', responses); 
        const prices = {};

        responses.forEach((response, index) => { // 
          const data = response.data['Global Quote'];
          console.log('data:', data); 
          const title = stockTitles[index]; 
          const price = parseFloat(data['05. price']);
          prices[title] = price; 
        });

        console.log('prices:', prices); 
        setStockPrices(prices);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching stock prices:', error);
        setLoading(false);
      }
    };

    fetchStockPrices();
  }, []); 

  return (
    <>
      <Title level={2} className="heading">Market Snapshot</Title>
      <Row gutter={[16, 16]}>
        {stockTitles.map((title, index) => (
          <Col key={index} span={8}>
            <Statistic title={title} value={loading ? 'Loading...' : stockPrices[title] || 'N/A'} />
          </Col>
        ))}
      </Row>
      <div className="home-heading-container">
        <Title level={2} className="home-title">Stock Market</Title>
        <Title level={3} className="show-more"><Link to = "/stocks">Show More</Link></Title>
      </div>
      <Stocks simplified/>
      <div className="home-heading-container">
        <Title level={2} className="home-title">Exchange Rates</Title>
        <Title level={3} className="show-more"><Link to = "/forex">Show More</Link></Title>
      </div>
      <Forex simplified/>
      <div className="home-heading-container">
        <Title level={2} className="home-title">Cryptocurrencies</Title>
        <Title level={3} className="show-more"><Link to = "/cryptocurrencies">Show More</Link></Title>
      </div>
      <Cryptocurrencies simplified/>
      <div className="home-heading-container">
        <Title level={2} className="home-title">Market News</Title>
        <Title level={3} className="show-more"><Link to = "/news">Show More</Link></Title>
      </div>
      <News simplified />
    </>
  );
};

export default Homepage;
