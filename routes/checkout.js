const { Router } = require('express');
const { apiHost }= require('./config.json');

const router = new Router();

router.get('/', (_, res) => {
  res.render('checkout', {
    apiHost,

    page: 'checkout',
    theme: '#f44336',
    title: 'Checkout',
  });
});

module.exports = router;
