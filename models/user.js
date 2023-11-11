const mongoose = require('mongoose')

const Schema = mongoose.Schema

const UserSchema = new Schema({
  firstName: { type: String, required: true, maxlength: 100 },
  lastName: { type: String, required: true, maxlength: 100 },
  username: { type: String, required: true, maxlength: 100 },
  password: { type: String, required: true, maxlength: 1000 },
  isMember: { type: Boolean, required: true, default: false },
})

UserSchema.virtual('fullName').get(function () {
  return `${this.firstName} ${this.lastName}`
})

UserSchema.virtual('url').get(function () {
  return `/users/${this._id}`
})

module.exports = mongoose.model('User', UserSchema)
