const router = require('express').Router()
const usersController = require('../controllers/usersController')
const postsController = require('../controllers/postsController')

router.get('/', postsController.index)

// users
// authentication
router.get('/sign_up', usersController.new)
router.post('/sign_up', usersController.create)
router.get('/login', usersController.login_get)
router.post('/login', usersController.login_post)
router.post('/logout', usersController.logout)

router.get('/membership', usersController.membership_get)
router.post('/membership', usersController.membership_post)

// posts
router.get('/posts/create', postsController.new)
router.post('/posts/create', postsController.create)
router.get('/posts/:id', postsController.show)
router.get('/posts/:id/update', postsController.edit)
router.post('/posts/:id/update', postsController.update)
router.post('/posts/:id/delete', postsController.delete)

module.exports = router
