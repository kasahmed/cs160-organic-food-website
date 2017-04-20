const { Router } = require('express');

const router = new Router();

router.get('/', (_, res) => {
  res.render('index', {
    isTitlePage: true,
    page: 'index',
    theme: '#ff9800',
    title: 'Home',
  });
});

module.exports = router;
