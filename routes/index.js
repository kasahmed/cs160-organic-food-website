const { Router } = require('express');

const router = new Router();

router.get('/', (_, res) => {
  res.render('index', {
    page: 'index',
    theme: '#ff9800',
    title: 'Home',
  });
});

module.exports = router;
