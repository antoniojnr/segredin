const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');
const validate = require('mongoose-validator');
const mongoosePaginate = require('mongoose-paginate');

const Schema = mongoose.Schema;
const ObjectId = Schema.ObjectId;

require('mongoose-type-email');

var user = new mongoose.Schema({
  username: {
    type: String,
    trim: true,
    lowercase: true,
    unique: true,
    uniqueCaseInsensitive: true,
    match: [/^[\wÁÉÍÓÚáéíóúàÂÊÔâêôãõç]+$/, "Handle must be one single word."],
    required: [true, 'Username must be defined.'] },
  first_name: {
    type: String,
    trim: true,
    match: [/^[\wÁÉÍÓÚáéíóúàÂÊÔâêôãõç]+$/, "First name must be one single word."],
    required: [true, 'First name must be defined.'] },
  last_name: {
    type: String,
    trim: true,
    match: [/^[\w]+$/, "Last name must be one single word."],
    required: [true, 'Last name must be defined.'] },
  email: {
    type: mongoose.SchemaTypes.Email,
    trim: true,
    unique: true,
    required: [true, 'Email must be defined.'] },
  password: {
    type: String,
    minlength: 8,
    required: [true, 'User password must be defined.'] },
  paired_with: {
    type: [{
      type: Schema.Types.ObjectId,
      ref: 'User'
    }],
    default: []
  }
});
user.plugin(mongoosePaginate);
user.plugin(uniqueValidator);

module.exports = mongoose.model('User', user);
