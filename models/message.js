// get an instance of mongoose and mongoose.Schema
var mongoose = require('mongoose'),
		Schema = mongoose.Schema,
		ObjectId = Schema.ObjectId;

// set up a mongoose model and pass it using module.exports
module.exports = mongoose.model('Message', new Schema({
    created_at: { type: Date, default: Date.now },
    from: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    to: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    read: { type: Boolean, default: false },
		deleted: { type: Boolean, default: false },
    text: { type: String, required: [true, 'Message text must be defined.'] }
}));
