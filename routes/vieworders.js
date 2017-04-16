/**
 * Created by Kashan on 4/2/2017.
 */

var express = require('express');
var http = require('https');
const config = require('./config.json');

var router = express.Router();

router.get('/vieworders', function(req, res) {

    res.render('orders', {items: []});
});


router.get('/vieworders/:ordernum', function(req, res) {


    var path = '/group_one/shop/order/' + req.params.ordernum;

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
            res.render('orders', {items: jsonArray});

        });
    }).end();


});

module.exports = router;