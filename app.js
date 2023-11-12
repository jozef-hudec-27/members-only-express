const createError = require('http-errors')
const express = require('express')
const path = require('path')
const cookieParser = require('cookie-parser')
const logger = require('morgan')
const expressLayouts = require('express-ejs-layouts')
const session = require('express-session')
const passport = require('passport')
const passportInitialize = require('./passport-config')
require('dotenv').config()

const indexRouter = require('./routes/routes')

const app = express()

// database setup
const mongoose = require('mongoose')
mongoose.set('strictQuery', false)
const mongoDB = process.env.DB_CONNECTION_STRING

dbConnect().catch((err) => console.log(err))
async function dbConnect() {
  await mongoose.connect(mongoDB)
}

// auth setup
passportInitialize(passport)

// view engine setup
app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'ejs')

// middleware
app.use(logger('dev'))
app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(cookieParser())
app.use(express.static(path.join(__dirname, 'public')))
app.use(expressLayouts)
app.use(session({ secret: process.env.EXPRESS_SESSION_SECRET, resave: false, saveUninitialized: true }))
app.use(passport.initialize())
app.use(passport.session())

app.use('/', indexRouter)

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404))
})

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message
  res.locals.error = req.app.get('env') === 'development' ? err : {}

  // render the error page
  res.status(err.status || 500)
  res.render('error')
})

module.exports = app
