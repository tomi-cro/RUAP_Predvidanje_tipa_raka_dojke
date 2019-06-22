const express = require('express');

const router = express.Router();

router.get('/', (req, res, next) => {
  console.log('mainslash')
  res.render('main', {pageTitle: 'Home', prediction: 2});
});

module.exports = router;