import React, { useState, useEffect } from 'react';
import { Typography, Row } from 'antd';
import axios from 'axios';
import moment from 'moment';

const { Title } = Typography;

const finApiKey = process.env.REACT_APP_FINANCE_APIKEY;
const newsUrl = `https://www.alphavantage.co/query?function=NEWS_SENTIMENT&topics=economy_monetary&apikey=${finApiKey}`;

const News = ({ simplified }) => {
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);
  const maxArticles = simplified ? 6 : 12;

  useEffect(() => {
    const fetchNews = async () => {
      try {
        const response = await axios.get(newsUrl);
        const articles = response.data.feed || [];
        const slicedArticles = articles.slice(0, maxArticles);
        setNews(slicedArticles);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching news:', error);
        setLoading(false);
      }
    };
  
    fetchNews();
  }, [maxArticles]);

  return (
    <div>
    
      {news.map((article, index) => (
        <Row key={index} style={{ marginBottom: 16 }}>
          <a href={article.url} target="_blank" rel="noopener noreferrer" style={{ color: 'black' }}>
            <div style={{ border: '1px solid #e8e8e8', padding: 16, borderRadius: 4 }}>
              <h3>{article.title}</h3>
              <p>{moment(article.published_at).format('MMMM Do YYYY, h:mm:ss a')}</p>
              <p>{article.text}</p>
            </div>
          </a>
        </Row>
      ))}
    </div>
  );
};

export default News;
