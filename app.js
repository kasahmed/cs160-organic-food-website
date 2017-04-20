const express = require('express');
const layouts = require('express-ejs-layouts');
const reload = require('reload');
const { createServer } = require('http');

const app = express();
const port = process.env.PORT || 3000;

app.set('view engine', 'ejs');
app.set('layout extractScripts', true);
app.set('layout extractStyles', true);
app.set('views', 'views');

app.use(express.static('public'));
app.use(layouts);

app.use('/', require('./routes/index'));
app.use('/inventory', require('./routes/inventory'));
app.use('/vieworders', require('./routes/vieworders'));
app.use('/trackorder', require('./routes/trackorder'));
app.use('/checkout', require('./routes/checkout'));

const server = createServer(app);

reload(server, app);

app.use((_, res) => {
  res.status(404).render('404');
});

server.listen(
  port,
  () => console.log(`Listening at http://localhost:${port}`)
);
