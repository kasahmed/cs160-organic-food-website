const { Router } = require('express');
const fetch = require('node-fetch');
const { apiHost }= require('./config.json');

const router = new Router();

router.get('/:city', async (req, res) => {
  const { city } = req.params;
  const response = await fetch(`${apiHost}/group_one/shop/products/${city}`);
  const items = await response.json();
  res.render('inventory', {
    city,
    items,

    page: 'inventory',
    title: (
      city
        .split('-')
        .map(word =>
          word
            .charAt(0)
            .toUpperCase()+ word.substring(1)
        )
        .join(' ')
    ),
    theme: '#2196f3',
  });
});

module.exports = router;
