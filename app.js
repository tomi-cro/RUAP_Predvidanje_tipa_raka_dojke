const path = require('path');
const express = require('express');
const bodyParser = require('body-parser');

const checkRoute = require('./routes/checkRoute');
const mainRoute = require('./routes/mainRoute');
const submitRoute = require('./routes/submitRoute');
const graphRoute = require('./routes/graphRoute');

const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended: false}));
app.use(express.static(path.join(__dirname, 'public')));

app.use(checkRoute);

app.use(mainRoute);

app.use(submitRoute);

app.use(graphRoute)

app.use((req, res, next) => {
  res.status(404).render('404', {pageTitle: 'Page not found'});
});

app.listen(3000);