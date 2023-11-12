const router = require('express').Router()
const passport = require('passport')
const usersController = require('../controllers/usersController')

router.get('/', async (req, res) => {
  res.render('posts/index', { title: 'Home' })
})

// users
// authentication
router.get('/sign_up', usersController.new)
router.post('/sign_up', usersController.create)
router.get('/login', usersController.login_get)
router.post('/login', usersController.login_post)
router.post('/logout', usersController.logout)

router.get('/membership', usersController.membership_get)
router.post('/membership', usersController.membership_post)

module.exports = router
