const { Router } = require('express');
const { apiHost, googleMapKey: apiKey }= require('./config.json');

const router = new Router();

router.get('/', (_, res) => {
  res.render('track-order', {
    apiHost,
    apiKey,
    calcRoute: ';',

    page: 'track-order',
    title: 'Track Order',
    theme: '#4caf50',
  });
});

module.exports = router;
