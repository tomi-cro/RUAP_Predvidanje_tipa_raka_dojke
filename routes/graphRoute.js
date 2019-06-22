const express = require('express');


const router = express.Router();

router.get('/graph', (req, res, next) => {
  console.log('showing graph');
  res.render('paracords', {pageTitle: 'Graph'});
});

module.exports = router;