const express = require('express');
const reload = require('reload');
const { createServer } = require('http');

const app = express();
const port = process.env.PORT || 3000;

app.set('view engine', 'ejs');
app.set('views', 'views');

app.use(express.static('public'));

app.use('/', require('./routes/index'));
app.use('/inventory', require('./routes/inventory'));
app.use('/vieworders', require('./routes/vieworders'));
app.use('/trackorder', require('./routes/trackorder'));
app.use('/checkout', require('./routes/checkout'));

const server = createServer(app);
server.listen(
  port,
  () => console.log(`Listening at http://localhost:${port}`)
);

reload(server, app);
