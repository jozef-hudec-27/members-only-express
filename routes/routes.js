const router = require('express').Router()
const usersController = require('../controllers/usersController')

router.get('/', async (req, res) => {
  res.render('index', { title: 'Home' })
})

// users
router.get('/sign_up', usersController.new)
router.post('/sign_up', usersController.create)

module.exports = router
