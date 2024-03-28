import React from 'react'
import { Button, Menu, Typography, Avatar } from 'antd'
import { Link } from 'react-router-dom'
import { HomeOutlined, BulbOutlined, MoneyCollectOutlined, ThunderboltOutlined, FundViewOutlined, LikeOutlined } from '@ant-design/icons'

import icon from '../images/weblogo.jpeg'
const Navbar = () => {
  return (
    <div className = "nav-container">
      <div className = "logo-container">
        <Avatar src={icon} size="large" />
          <Typography.Title level={2} className = "logo">
            <Link to="/"> Marketplace </Link>
          </Typography.Title>
      </div>
      <Menu theme= "dark">
        <Menu.Item icon = {<HomeOutlined />}>
          <Link to = "/">Home</Link>
        </Menu.Item>
        <Menu.Item icon={<FundViewOutlined />}>
          <Link to="/stocks">Stocks</Link>
        </Menu.Item>
        <Menu.Item icon={<MoneyCollectOutlined />}>
          <Link to="/forex">Exchange Rates</Link>
        </Menu.Item>
        <Menu.Item icon = {<ThunderboltOutlined />}>
          <Link to = "/cryptocurrencies">Crypotcurrencies</Link>
        </Menu.Item>        
        <Menu.Item icon = {<LikeOutlined />}>
          <Link to = "/watchlist">Watchlist</Link>
        </Menu.Item>
        <Menu.Item icon = {<BulbOutlined />}>
          <Link to = "/news">News</Link>
        </Menu.Item>
      </Menu>
    </div>
  )
}

export default Navbar