const { Router } = require('express');
const { apiHost, googleMapKey: apiKey, pubPublishKey: pubKey, pubSubscribeKey: subKey}= require('./config.json');

const router = new Router();

router.get('/', (_, res) => {
  res.render('checkout', {
	apiHost,
    apiKey,
    pubKey,
    subKey,
    page: 'checkout',
    theme: '#f44336',
    title: 'Checkout',
  });
});

module.exports = router;
