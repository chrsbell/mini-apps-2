import React, { useState, useEffect, useRef } from 'react';
import ReactDOM from 'react-dom';
import Chart from 'chart.js';
import axios from 'axios';
import styled from 'styled-components';

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const FlexRow = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
`;

const Footer = styled.a`
  color: orange;
  font-size: 24px;
`;

const App = () => {
  // bitcoin price data from last 30 days
  const [prices, setPrices] = useState({ labels: null, data: null });
  const [chartContext, setChartContext] = useState(null);
  const canvas = useRef(null);

  const getBitcoinData = () => {
    // get a token to cancel the request if necessary
    const source = axios.CancelToken.source();
    axios
      .get('/api/data', {
        options: { cancelToken: source.token },
      })
      .then((res) => {
        if (res.status === 200 && res.data) {
          setPrices({
            labels: Object.keys(res.data),
            data: Object.values(res.data),
          });
          const element = document.getElementById('myChart').getContext('2d');
          setChartContext(element);
        }
      })
      .catch((err) => {
        console.error('Could not complete API request.');
      });
    // cancel async request on component unmount
    return () => source.cancel('Axios request aborted.');
  };

  // component mount
  useEffect(() => {
    const cancelFunc = getBitcoinData();
    return cancelFunc;
  }, []);

  // on context change
  useEffect(() => {
    if (chartContext) {
      let max = Math.round(Math.max(...prices.data));
      // create color gradient
      let colors = prices.data.map((price) => {
        return `hsl(${Math.round((price / max) * 360)},100%,50%)`;
      });
      console.table(colors);
      const chart = new Chart(chartContext, {
        type: 'bar',
        data: {
          labels: prices.labels,
          datasets: [
            {
              label: 'Bitcoin Price',
              data: prices.data,
              borderColor: colors,
              backgroundColor: colors,
              hoverBackgroundColor: colors,
              hoverBorderColor: colors,
              borderWidth: 1,
            },
          ],
        },
        options: {
          scales: {
            yAxes: [
              {
                ticks: {
                  beginAtZero: true,
                },
              },
            ],
          },
        },
      });
    }
  }, [chartContext]);

  return (
    <>
      <Container>
        <h1>Crypto Charting Tool</h1>
        <canvas width="1280" height="720" id="myChart"></canvas>
        <FlexRow>
          <Footer href="https://www.coindesk.com/price/bitcoin">Powered by CoinDesk</Footer>
          <h3>© 2020 Copyright Chris Bell</h3>
        </FlexRow>
      </Container>
    </>
  );
};

ReactDOM.render(<App />, document.getElementById('app'));
