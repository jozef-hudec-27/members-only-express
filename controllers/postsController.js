const Post = require('../models/post')
const { body, validationResult } = require('express-validator')
const asyncHandler = require('express-async-handler')

exports.new = async (req, res, next) => {
  if (!req.user) return res.redirect('/login')

  res.render('posts/form', { title: 'Create Post' })
}

exports.create = [
  body('title', 'Title must be between 1 and 100 characters!').trim().isLength({ min: 1, max: 100 }).escape(),
  body('body', 'Body must be between 1 and 1000 characters!').trim().isLength({ min: 1, max: 1000 }).escape(),

  asyncHandler(async (req, res, next) => {
    if (!req.user) return res.redirect('/login')

    const errors = validationResult(req)

    const post = new Post({ title: req.body.title, body: req.body.body, user: req.user._id })

    if (!errors.isEmpty()) {
      return res.render('posts/new', { title: 'Create Post', post: post, errors: errors.array() })
    }

    await post.save()
    res.redirect(post.url)
  }),
]

exports.edit = asyncHandler(async (req, res, next) => {
  if (!req.user) return res.redirect('/login')

  const post = await Post.findById(req.params.id)

  if (!post) {
    return next(new Error('Post not found!'))
  } else if (post.user.toString() !== req.user._id.toString()) {
    return next(new Error('You are not authorized to edit this post!'))
  }

  res.render('posts/form', { title: 'Edit Post', post: post })
})

exports.update = [
  body('title', 'Title must be between 1 and 100 characters!').trim().isLength({ min: 1, max: 100 }).escape(),
  body('body', 'Body must be between 1 and 1000 characters!').trim().isLength({ min: 1, max: 1000 }).escape(),

  asyncHandler(async (req, res, next) => {
    if (!req.user) return res.redirect('/login')

    const errors = validationResult(req)

    const post = await Post.findById(req.params.id)

    if (!post) {
      return next(new Error('Post not found!'))
    } else if (post.user.toString() !== req.user._id.toString()) {
      return next(new Error('You are not authorized to edit this post!'))
    }

    if (!errors.isEmpty()) {
      return res.render('posts/form', { title: 'Edit Post', post: post, errors: errors.array() })
    }

    post.title = req.body.title
    post.body = req.body.body
    await post.save()

    res.redirect(post.url)
  }),
]

exports.delete = asyncHandler(async (req, res, next) => {
  if (!req.user) return res.redirect('/login')

  const post = await Post.findById(req.params.id)

  if (!post) {
    return next(new Error('Post not found!'))
  } else if (post.user.toString() !== req.user._id.toString()) {
    return next(new Error('You are not authorized to delete this post!'))
  }

  await Post.findByIdAndDelete(req.params.id)

  res.redirect('/')
})

exports.index = asyncHandler(async (req, res, next) => {
  const posts = await Post.find().populate('user')

  res.render('posts/index', { title: 'Posts', posts })
})

exports.show = async (req, res, next) => {
  const post = await Post.findById(req.params.id).populate('user')

  if (!post) return next(new Error('Post not found!'))

  res.render('posts/show', { title: post.title, post: post })
}
