const { Router } = require('express');
const fetch = require('node-fetch');
const { apiHost }= require('./config.json');

const router = new Router();

router.get('/:city', async (req, res) => {
  const { city } = req.params;
  const response = await fetch(`${apiHost}/group_one/shop/products/${city}`);
  const items = await response.json();
  res.render('product', { city, items });
});

module.exports = router;
