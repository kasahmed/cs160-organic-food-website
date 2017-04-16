/**
 * Created by Kashan on 3/29/2017.
 */

var express = require('express');
var reload = require('reload');
var app = express();

app.set('port', process.env.PORT || 3000);
app.set('view engine', 'ejs');
app.set('views', 'views');

app.use(express.static('public'));

app.use(require('./routes/index'));
app.use(require('./routes/inventory'));
app.use(require('./routes/vieworders'));
app.use(require('./routes/trackorder'));
app.use(require('./routes/checkout'));


var server = app.listen(3000, function() {
    console.log('Listening on port  ' + app.get('port'));
});

reload(server, app);