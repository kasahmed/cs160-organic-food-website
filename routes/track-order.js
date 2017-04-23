const { Router } = require('express');
const { apiHost, googleMapKey: apiKey }= require('./config.json');

const router = new Router();

router.get('/', (_, res) => {
  res.render('track-order', {
    apiHost,
    apiKey,

    page: 'track-order',
    theme: '#4caf50',
    title: 'Track Order',
  });
});

module.exports = router;
