const User = require('../models/user')
const bcrypt = require('bcryptjs')
const passport = require('passport')
const { body, validationResult } = require('express-validator')

exports.new = async (req, res) => {
  res.render('users/sign_up', { title: 'Sign Up' })
}

exports.create = [
  body('firstName', 'First name must be between 1 and 100 characters!').trim().escape().isLength({ min: 1, max: 100 }),
  body('lastName', 'Last name must be between 1 and 100 characters!').trim().escape().isLength({ min: 1, max: 100 }),
  body('username')
    .trim()
    .escape()
    .isLength({ min: 1, max: 100 })
    .withMessage('Username must be between 1 and 100 characters!')
    .custom(async (value) => {
      const user = await User.findOne({ username: value })

      if (user) throw new Error('Username must be unique!')
    }),
  body('password', 'Password must be between 6 and 64 characters!').trim().isLength({ min: 6, max: 64 }),
  body('passwordConfirmation').custom((value, { req }) => {
    if (value !== req.body.password) throw new Error('Passwords do not match!')

    return true
  }),

  async (req, res, next) => {
    bcrypt.hash(req.body.password, 10, async (err, hashedPassword) => {
      if (err) return next(err)

      const errors = validationResult(req)

      try {
        const user = new User({
          firstName: req.body.firstName,
          lastName: req.body.lastName,
          username: req.body.username,
          password: hashedPassword,
        })

        if (!errors.isEmpty()) {
          return res.render('users/sign_up', { title: 'Sign Up', user: user, errors: errors.array() })
        }

        await user.save()
        res.redirect('/')
      } catch (err) {
        next(err)
      }
    })
  },
]

exports.login_get = async (req, res) => {
  res.render('users/login', { title: 'Login', error: req.flash ? req.flash('error') : null })
}

exports.login_post = passport.authenticate('local', {
  successRedirect: '/',
  failureRedirect: '/login',
  failureFlash: true,
})

exports.logout = (req, res, next) => {
  req.logout((err) => {
    if (err) return next(err)

    res.redirect('/')
  })
}
