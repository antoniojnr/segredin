var express = require('express');
var app = express();
var bcrypt = require('bcrypt-nodejs');
var User   = require('./models/user');
var jwt    = require('jsonwebtoken');
var config = require('config');

var apiRoutes = express.Router();

apiRoutes.post('/authenticate', function(req, res, next) {
  // find the user
  User.findOne({ username: req.body.username }, function(err, user) {
    if (err) {
      res.json({
        success: false,
        details: err
      });
      next();
    }

    if (!user ||
        !(user && bcrypt.compareSync(req.body.password, user.password))) {
      res.json({
        success: false,
        message: 'Authentication failed. Wrong combination of user and password.'
      });
    } else {
      var token = jwt.sign({ uid: user._id.toString() }, config.get('secret'), {
        expiresIn: "1d" // expires in 24 hours
      });
    }

    res.json({
      success: true,
      token: token
    });
  });
});

// create a new user (POST http://localhost:8080/api/users)
apiRoutes.post('/users', function(req, res) {
  var newUser = new User({
    username: req.body.username,
    first_name: req.body.first_name,
    last_name: req.body.last_name,
    email: req.body.email,
    password: bcrypt.hashSync(req.body.password)
  });

  newUser.save(function(err) {
    if (err) {
      res.json({
        success: false,
        details: err
      });
    } else {
      res.json({
        success: true,
        user: {
          id: newUser._id
        }
      });
    }
  });
});

module.exports = apiRoutes;
