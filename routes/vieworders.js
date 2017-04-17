const { Router } = require('express');
const fetch = require('node-fetch');
const { apiHost }= require('./config.json');

const router = new Router();

router.get('/', (_, res) => {
  res.render('orders', { items: [] });
});

router.get('/:id', async (req, res) => {
  const { id: orderNumber } = req.params;
  const response = await fetch(
    `${apiHost}/group_one/shop/order/${orderNumber}`
  );
  const items = await response.json();
  res.render('orders', { items });
});

module.exports = router;
