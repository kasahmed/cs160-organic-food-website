const { Router } = require('express');

const router = new Router();

router.get('/', (_, res) => {
  res.render('index');
});

module.exports = router;
