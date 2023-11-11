const mongoose = require('mongoose')

const PostSchema = new mongoose.Schema({
  title: { type: String, required: true, maxlength: 100 },
  body: { type: String, required: true, maxlength: 1000 },
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  createdAt: { type: Date, default: Date.now },
})

PostSchema.virtual('url').get(function () {
  return `/posts/${this._id}`
})

module.exports = mongoose.model('Post', PostSchema)
