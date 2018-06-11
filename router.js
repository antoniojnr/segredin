var express = require('express');
var app = express();
var router = new express.Router();
var jwt    = require('jsonwebtoken'); // used to create, sign, and verify tokens
var mongoose = require('mongoose');
const config = require('config');

router.use(require("./open_routes"));

router.get('/test', function(req, res) {
  res.send('Funciona!');
})

router.use(function(req, res, next) {

  // check header or url parameters or post parameters for token
  var token = req.body.token || req.query.token || req.headers['authorization'];
  token = token.substring("Bearer ".length);

  // decode token
  if (token) {
    // verifies secret and checks exp
    jwt.verify(token, config.get('secret'), function(err, decoded) {
      if (err) {
        console.log(err);
        return res.json({ success: false, message: 'Failed to authenticate token.' });
      } else {
        // if everything is good, save to request for use in other routes
        req.uid = decoded.uid;
        next();
      }
    });

  } else {

    // if there is no token
    // return an error
    return res.status(403).send({
        success: false,
        message: 'No token provided.'
    });

  }
});

router.use('/users', require("./user_routes"));
router.use('/messages', require("./message_routes"));

module.exports = router;
