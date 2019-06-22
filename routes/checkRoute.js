const express = require('express');

const router = express.Router();

router.use('/check', (req, res, next) => {
  res.render('submitData', {pageTitle: 'Submit your data'});
});

module.exports = router;