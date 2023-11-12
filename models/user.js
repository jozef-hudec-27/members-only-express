const mongoose = require('mongoose')

const UserSchema = new mongoose.Schema({
  firstName: { type: String, required: true, maxlength: 100 },
  lastName: { type: String, required: true, maxlength: 100 },
  username: { type: String, required: true, maxlength: 100, unique: true },
  password: { type: String, required: true, minlength: 6, maxlength: 64 },
  isMember: { type: Boolean, required: true, default: false },
})

UserSchema.virtual('fullName').get(function () {
  return `${this.firstName} ${this.lastName}`
})

UserSchema.virtual('url').get(function () {
  return `/users/${this._id}`
})

module.exports = mongoose.model('User', UserSchema)
