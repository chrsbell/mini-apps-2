const express = require('express');
const app = express();
const path = require('path');
const axios = require('axios');

app.use(express.static(__dirname + '/../public'));

app.get('/api/data', async (req, res) => {
  try {
    const bcp_res = await axios.get('https://api.coindesk.com/v1/bpi/historical/close.json');
    // only send data to back end if data was successfully received
    if (bcp_res.data) {
      debugger;
      res.status(200).json(bcp_res.data.bpi);
    }
  } catch (err) {
    console.error(err);
    res.sendStatus(400);
  }
});

app.listen('3000', () => {
  console.log('listening at http://localhost:3000');
});
