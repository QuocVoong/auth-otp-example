const mongoose   = require('mongoose');
const { Schema } = mongoose;

const UserSchema = new Schema({
  name:          { type: String, index: true, required: true, min: 1, max: 255 },
  email:         { type: String, index: true, unique: true, min: 1, max: 255 },
  password_hash: { type: String, required: true },
  temporary_key:           { type: String, required: true },
  created:       { type: Number },
  latest:        { type: Number },
}, {
  versionKey: false,
});

module.exports = mongoose.model('User', UserSchema);