var express = require('express');
var app = express();
var router = new express.Router();
var jwt    = require('jsonwebtoken'); // used to create, sign, and verify tokens
var mongoose = require('mongoose');
var secret = '97b63dc3728689e351d119fdae6bf2c35eda51dd94e8274d2b0800b118571a1ee4a2f1fc9185792e6a85cc6a30580966db044f5332d55bc09377dd2b561925b9';

router.use(require("./open_routes"));

router.use(function(req, res, next) {
  var token = req.body.token || req.query.token || req.headers['authorization'];

  if (token) {
    token = token.substring("Bearer ".length);

    jwt.verify(token, secret, function(err, decoded) {
      if (err) {
        console.log(err);
        return res.json({ success: false, message: 'Failed to authenticate token.' });
      } else {
        req.uid = decoded.uid;
        next();
      }
    });
  } else {
    return res.status(403).send({
        success: false,
        message: 'No token provided.'
    });
  }
});

router.use('/users', require("./user_routes"));
router.use('/messages', require("./message_routes"));

module.exports = router;
