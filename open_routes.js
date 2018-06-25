var express = require('express');
var app = express();
var bcrypt = require('bcrypt-nodejs');
var User   = require('./models/user');
var jwt    = require('jsonwebtoken');
var secret = '97b63dc3728689e351d119fdae6bf2c35eda51dd94e8274d2b0800b118571a1ee4a2f1fc9185792e6a85cc6a30580966db044f5332d55bc09377dd2b561925b9';
var apiRoutes = express.Router();

apiRoutes.get('/test', function(req, res) {
  res.send('Funciona!');
})

apiRoutes.post('/authenticate', function(req, res) {
  // find the user
  User.findOne({ username: req.body.username }, function(err, user) {
    if (err) {
      res.json({
        success: false,
        details: err
      });
      return;
    }

    var success = false;
    var message, token;
    if (!user ||
        !(user && bcrypt.compareSync(req.body.password, user.password))) {
        message = 'Authentication failed. Wrong combination of user and password.';
    } else {
      success = true;
      token = jwt.sign({ uid: user._id.toString() }, secret, {
        expiresIn: "1d" // expires in 24 hours
      });
    }

    res.json({
      success,
      token,
      message
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
