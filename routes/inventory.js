/**
 * Created by Kashan on 3/29/2017.
 */

var express = require('express');
var http = require('https');
var config = require('./config.json');

var router = express.Router();

router.get('/inventory/:city', function(req, res) {

    var path = '/group_one/shop/products/' + req.params.city;

    var options = {
        host: config.api_host,
        path: path,
        //port: 80,
        method: 'GET'
    };

    http.request(options, function(r){


        var body = '';
        var array = [];
        r.on('data', function(chunk){
            body += chunk;
        });

        r.on('end', function(){

            var jsonArray = JSON.parse(body);

            var size = jsonArray.length;
            var htmlItems = "";
            res.render('product', {city: req.params.city, items: jsonArray});

        });
    }).end();



});

module.exports = router;