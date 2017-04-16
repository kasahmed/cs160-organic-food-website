/**
 * Created by Kashan on 4/6/2017.
 */

var express = require('express');
var http = require('https');
const config = require('./config.json');

var router = express.Router();


router.get('/trackorder', function(req, res) {

    res.render('liveTrackTest', {calcRoute: ';', apiKey: config.googleMapKey, apiHost: "https://"  + config.api_host});
});


module.exports = router;