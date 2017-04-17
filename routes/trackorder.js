const { Router } = require('express');
const { apiHost, googleMapKey: apiKey }= require('./config.json');

const router = new Router();

router.get('/', (_, res) => {
  res.render('liveTrackTest', {
    apiHost,
    apiKey,
    calcRoute: ';',
  });
});

module.exports = router;
