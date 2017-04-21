const express = require('express');
const layouts = require('express-ejs-layouts');
const reload = require('reload');
const { createServer } = require('http');

const app = express();
const port = process.env.PORT || 3000;

app.set('view engine', 'ejs');
app.set('views', 'views');

app.set('layout', 'partials/layout');
app.set('layout extractScripts', true);
app.set('layout extractStyles', true);

app.use(express.static('public'));
app.use(layouts);

app.use('/', require('./routes/index'));
app.use('/inventory', require('./routes/inventory'));
app.use('/orders', require('./routes/orders'));
app.use('/track-order', require('./routes/track-order'));
app.use('/checkout', require('./routes/checkout'));

const server = createServer(app);

reload(server, app);

app.use((_, res) => {
  res.status(404).render('404', {
    page: '404',
    theme: '#f44336',
    title: 'Nothing Found :(',
  });
});

server.listen(
  port,
  () => console.log(`Listening at http://localhost:${port}`)
);
