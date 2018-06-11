var express = require('express');
var app = express();
var User   = require('./models/user');
var Message   = require('./models/message');
var ObjectId = require('mongoose').Types.ObjectId;

var routes = express.Router();

routes.get('', function(req, res, next) {
  console.log(req.query.page);
  User
    .paginate(
      { id : { $ne: ObjectId(req.uid) } },
      {
        select: { __v: 0, paired_with: 0, email: 0, last_name: 0, password: 0 },
        page: +req.query.page || 1,
        limit: 10
      },
      function(err, users) {
        if (err) {
          res.json({
            success: false,
            details: err
          });
          next();
        }

        res.json(users);
      });
});


routes.get('/me', function(req, res, next) {
  console.log(req.uid);
  User
    .findById(req.uid)
    .select({ __v: 0, _id: 0, password: 0 })
    .exec(function(err, user) {
      if (err) {
        res.json({
          success: false,
          details: err
        });
        next();
      }

    getUserMessages({ to: ObjectId(req.uid) }, function(err, msgsToMe) {
      if (err) {
        res.json({
          success: false,
          details: err
        });
        next();
      }

      getUserMessages({ from: ObjectId(req.uid) }, function(err, msgsFromMe) {
        if (err) {
          res.json({
            success: false,
            details: err
          });
          next();
        }

        var senders = msgsToMe.map((m) => m.from._id);
        var recipients = msgsFromMe.map((m) => m.to._id);
        var filtered = msgsToMe
          .filter(msg => isMessageVisible(msg, recipients))
          .map(msg => msg.read ? {
            _id: msg._id,
            read: msg.read,
            from: msg.from,
            to: msg.to,
            text: msg.text,
            created_at: msg.created_at
          } : {
            _id: msg._id,
            read: msg.read,
            from: msg.from,
            to: msg.to,
            created_at: msg.created_at
          })

        res.json({
          user,
          messages: filtered,
          sent: msgsFromMe
        });
      });
    });
  });
});

function isMessageVisible(msg, recipients) {
  for (var r of recipients) {
    if (msg.from._id.equals(r)) {
      return true;
    }
  }
  return false;
}

function getUserMessages(crit, cb) {
  Message
    .find(crit)
    .select({ __v: 0, deleted: 0 })
    .populate('from', '_id username first_name last_name')
    .populate('to', '_id username first_name last_name')
    .exec(function(err, messages) {
      cb(err, messages);
    });
}

module.exports = routes;
