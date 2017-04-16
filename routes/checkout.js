/**
 * Created by Kashan on 4/13/2017.
 */

var express = require('express');
var http = require('https');
const config = require('./config.json');

var router = express.Router();

router.get('/checkout', function(req, res) {
    res.render('checkout', {items: [], apiHost: "https://"  + config.api_host});
});


module.exports = router;