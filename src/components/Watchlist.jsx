import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Row, Col, Card, Statistic, message } from 'antd';
import { PushpinOutlined } from '@ant-design/icons';

const Watchlist = () => {
  const [stocks, setStocks] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('https://api.airtable.com/v0/appGUUc6WOMDXQ9Xa/Table%201', {
          headers: {
            Authorization: `Bearer ${process.env.REACT_APP_AIRTABLE_TOKEN}`
          },
        });

        const records = response.data.records;

        const stocksData = records.map(record => ({
          id: record.id,
          ticker: record.fields.Ticker,
          price: record.fields.Price,
        }));

        setStocks(stocksData);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

  const handleDelete = async (id) => {
    try {
      await axios.delete(`https://api.airtable.com/v0/appGUUc6WOMDXQ9Xa/Table%201/${id}`, {
        headers: {
          Authorization: 'Bearer patzSSPPqGZEE7Zut.e0c9ae2638a02ee57a0ca498fce473d08bc389e766b71abe26c4c2db357516fa'
        },
      });
  
      setStocks(prevStocks => prevStocks.filter(stock => stock.id !== id));
  
      message.success('Stock removed successfully');
    } catch (error) {
      console.error('Error deleting record:', error);
  
      message.error('Failed to delete stock');
    }
  };
  return (
    <div>
      <Row gutter={[16, 16]}>
        {stocks.map((stock, index) => (
          <Col key={index} span={8}>
            <Card title={stock.ticker} extra={<PushpinOutlined style={{ fontSize: 24, cursor: 'pointer' }} onClick={() => handleDelete(stock.id)}/>}>
              <Statistic title="Price" value={stock.price} />
            </Card>
          </Col>
        ))}
      </Row>
    </div>
  );
};

export default Watchlist;
