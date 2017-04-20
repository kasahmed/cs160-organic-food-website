const { Router } = require('express');
const fetch = require('node-fetch');
const { apiHost }= require('./config.json');

const router = new Router();

router.get('/', (_, res) => {
  res.render('orders', {
    items: [],

    page: 'orders',
    title: 'Orders',
    theme: '#3f51b5',
  });
});

router.get('/:id', async (req, res) => {
  const { id: orderNumber } = req.params;
  const response = await fetch(
    `${apiHost}/group_one/shop/order/${orderNumber}`
  );
  const items = await response.json();
  res.render('orders', {
    items,

    page: 'orders',
    title: 'Orders',
    theme: '#3f51b5',
  });
});

module.exports = router;
