//IMPORTS
const express = require('express')
const bcrypt = require('bcrypt')
const passport = require('passport')

//router initialization
const router = express.Router()

//MODELS
const User = require('../models/user')

//ROUTES

//render register form
router.get('/register', (req, res) => {
    res.render('register')
})

//register user
router.post('/register', async (req, res) => {
    const name = req.body.name
    const email = req.body.email
    const username = req.body.username
    const password = req.body.password

    req.checkBody('name', 'Name is required').notEmpty()
    req.checkBody('email', 'Email is required').notEmpty()
    req.checkBody('username', 'Username is required').notEmpty()
    req.checkBody('password', 'Password is required').notEmpty()
    req.checkBody('password2', 'Passwords do not match').equals(password)

    const errors = req.validationErrors()

    if (errors) {
        res.render('register', { errors: errors })
    } else {
        const salt = await bcrypt.genSalt(10)
        const newUser = await User.create({
            name: req.body.name,
            email: req.body.email,
            username: req.body.username,
            password: await bcrypt.hash(req.body.password, salt)
        })
        newUser.save()
        req.flash('success', 'You are now rgistered and can log in')
        res.redirect('/users/login')
    }
})

//render login page
router.get('/login', (req, res) => {
    res.render('login')
})

//login user
router.post('/login', (req, res, next) => {
    passport.authenticate('local', {
        successRedirect: '/',
        failureRedirect: '/users/login',
        failureFlash: true
    })(req, res, next)
})

//logout user
router.get('/logout', (req, res) => {
    req.logout()
    req.flash('success', 'You are logged out')
    res.redirect('/users/login')
})

module.exports = router