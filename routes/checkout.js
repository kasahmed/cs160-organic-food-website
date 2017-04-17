const { Router } = require('express');
const { apiHost }= require('./config.json');

const router = new Router();

router.get('/', (_, res) => {
  res.render('checkout', {
    apiHost,
    items: [],
  });
});

module.exports = router;
