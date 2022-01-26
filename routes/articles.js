//IMPORTS
const express = require('express')
const router = express.Router()

//MODELS
const Article = require('../models/article')
const User = require('../models/user')

//authentication middleware
const ensureAuthenticated = (req, res, next) => {
    if (req.isAuthenticated()) return next()
    else {
        req.flash('danger', 'Please login')
        res.redirect('/users/login')
    }
}

//render add article page
router.get('/add', ensureAuthenticated, (req, res) => {
    res.render('add_article', {
        title: 'Add Articles'
    })
})

//save article to db
router.post('/add', async (req, res) => {
    try {
        req.checkBody('title', 'Title is required').notEmpty()
        req.checkBody('body', 'Body is required').notEmpty()

        const errors = req.validationErrors()

        if (errors) {
            res.render('add_article', {
                title: 'Add Article',
                errors: errors
            })
        } else {
            const article = await Article.create({
                title: req.body.title,
                author: req.user._id,
                body: req.body.body
            })
            article.save()
            req.flash('success', 'Article Added')
            res.redirect('/')
        }
    } catch (error) {
        res.send(error)
    }
})

//render edit form
router.get('/edit/:id', ensureAuthenticated, async (req, res) => {
    try {
        const article =  await Article.findById(req.params.id)
        if (article.author != req.user._id) {
            req.flash('danger', 'Not Authorized')
            return res.redirect('/')
        }
        res.render('edit_article', {
            title: 'Edit article',
            article: article
        })
    } catch (error) {
        res.send(error)
    }
})

//edit article logic
router.post('/edit/:id', async (req, res) => {
    try {
        console.log(req.body.name)
        const article = {
            title: req.body.title,
            author: req.body.name,
            body: req.body.body
        }

        const query = { _id: req.params.id }

        const update = await Article.update(query, article)
        if (update) {
            req.flash('success', 'Article Updated')
            res.redirect('/')
        } return
    } catch(error) {
        res.send(error)
    }
})

//delete article
router.delete('/:id', async (req, res) => {
    try {
        if (!req.user._id) res.status(500).send()
        const query = { _id: req.params.id }
        const article = await Article.findById(req.params.id)
        if (article.author != req.user._id) {
            res.status(500).send()
        } else {
            const remove = await Article.findByIdAndRemove(query)
            if (remove) res.send('Success')
        }
    } catch (error) {
        res.send(error)
    }
})

//render single article
router.get('/:id', async (req, res) => {
    const article = await Article.findById(req.params.id)
    const user = await User.findById(article.author)
    if (user) {
        res.render('article', {
            article: article,
            author: user.name
        })
    }
})

module.exports = router