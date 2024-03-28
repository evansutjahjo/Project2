import React, { useState } from 'react';
import axios from 'axios';
import { Routes, Route, Link } from 'react-router-dom';
import { Layout, Typography, Space } from 'antd';

import { Navbar, Homepage, Forex, Stocks, News, Cryptocurrencies, Watchlist } from './components'
import "./App.css"

const App = () => {
  const [watchStocks, setWatchStocks] = useState([]);
  return (
    <div className = "app">
      <div className = "navbar">
        <Navbar />
      </div>
      <div className = "main">
          <Layout>
            <div className="routes">
              <Routes>
                <Route exact path="/" element={<Homepage />} />
                <Route exact path="/forex" element={<Forex />} />
                <Route exact path="/cryptocurrencies" element={<Cryptocurrencies />} />
                <Route exact path="/stocks" element={<Stocks />} />
                <Route exact path="/watchlist" element={<Watchlist watchStocks={watchStocks} />} />
                <Route exact path="/news" element={<News />} />
              </Routes>
            </div>
          </Layout>

        
        <div className = "footer">
          <Typography.Title level = {5} style = {{ color: 'white', textAlign: 'center' }}>Project 2 <br /> Please let me pass</Typography.Title>
          <Space>
            <Link to ="/">Home</Link>
            <Link to ="/news">News</Link>
          </Space>
        </div>
      </div>
    </div>
  )
}

export default App