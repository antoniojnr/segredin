var express = require('express');
var app = express();
var Message   = require('./models/message');
var User   = require('./models/user');
var ObjectId = require('mongoose').Types.ObjectId;

var routes = express.Router();

// routes.delete('/:msgId', function(req, res, next) {
//   Message.findById(req.params.msgId)
//     .exec(function(err, message) {
//       if (err) {
//         res.json({
//           success: false,
//           details: err
//         });
//         next();
//       }
//
//       if (!message.to.equals(ObjectId(req.uid))) {
//         res.json({
//           success: false,
//           details: 'You cannot read this message.'
//         });
//         next();
//       } else {
//         if (!message.read) {
//           message.read = true;
//           message.save(function(err) {
//             if (err) {
//               res.json({
//                 success: false,
//                 details: err
//               });
//             } else {
//               res.json({
//                 success: true,
//                 message
//               });
//             }
//           });
//         } else {
//           res.json({
//             success: true,
//             message
//           });
//         }
//       }
//     });
// });

routes.get('/:msgId', function(req, res, next) {
  Message.findById(req.params.msgId)
    .select({ __v: 0, deleted: 0 })
    .populate('from', '_id username first_name last_name')
    .populate('to', '_id username first_name last_name')
    .exec(function(err, message) {
      if (err) {
        res.json({
          success: false,
          details: err
        });
        next();
      }

      if (!message.to.equals(ObjectId(req.uid))) {
        res.json({
          success: false,
          details: 'You cannot read this message.'
        });
        next();
      } else {
        message.read = true;
        message.save(function(err) {
          if (err) {
            res.json({
              success: false,
              details: err
            });
          } else {
            res.json({
              success: true,
              message
            });
          }
        });
      }
    });
});

routes.post('', function(req, res, next) {
  if (req.body.to.id) {
    User.findById(ObjectId(req.body.to.id), function(err, user) {
      if (err) {
        res.json({
          success: false,
          details: err
        });
        next();
      }

      if (!user) {
        res.json({
          success: false,
          message: "User not found."
        });
        next();
      }

      sendMessage(res, req.uid, req.body.to.id, req.body.text);
    });
  } else if (req.body.to.username) {
    User.findOne({ username: req.body.to.username }, function(err, user) {
      if (err) {
        res.json({
          success: false,
          details: err
        });
        next();
      }

      if (!user) {
        res.json({
          success: false,
          message: "User not found."
        });
        next();
      }

      sendMessage(res, req.uid, user._id, req.body.text);
    });
  }
});

function sendMessage(res, from, to, text) {
  var newMessage = new Message({
    from,
    to,
    text
  });

  newMessage.save(function(err) {
    if (err) {
      res.json({
        success: false,
        details: err
      });
    } else {
      res.json({
        success: true,
        message: {
          id: newMessage._id
        }
      });
    }
  });
}
module.exports = routes;
