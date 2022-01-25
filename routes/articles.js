//IMPORTS
const express = require('express')
const router = express.Router()

//MODELS
const Article = require('../models/article')

//render add article page
router.get('/add', (req, res) => {
    res.render('add_article', {
        title: 'Add Articles'
    })
})

//save article to db
router.post('/add', (req, res) => {

    req.checkBody('title', 'Title is required').notEmpty()
    req.checkBody('author', 'Author is required').notEmpty()
    req.checkBody('body', 'Body is required').notEmpty()

    const errors = req.validationErrors()

    if (errors) {
        res.render('add_article', {
            title: 'Add Article',
            errors: errors
        })
    } else {
        const article = new Article()
        article.title = req.body.title
        article.author = req.body.author
        article.body = req.body.body

        article.save(error => {
            if (error) {
                console.log(error)
                return
            }
            req.flash('success', 'Article Added')
            res.redirect('/')
        })
    }
})

//render edit form
router.get('/edit/:id', (req, res) => {
    Article.findById(req.params.id, (error, article) => {
        res.render('edit_article', {
            title: 'Edit article',
            article: article
        })
    })
})

//edit article logic
router.post('/edit/:id', (req, res) => {
    const article = {}
    article.title = req.body.title
    article.author = req.body.author
    article.body = req.body.body

    const query = { _id: req.params.id }

    Article.update(query, article, error => {
        if (error) {
            console.log(error)
            return
        }
        req.flash('success', 'Article Updated')
        res.redirect('/')
    })
})

//delete article
router.delete('/:id', (req, res) => {
    const query = { _id: req.params.id }
    Article.remove(query, error => {
        if (error) {
            console.log(error)
            return
        }
        res.send('Success')
    })
})

//render single article
router.get('/:id', (req, res) => {
    Article.findById(req.params.id, (error, article) => {
        res.render('article', {
            article: article
        })
    })
})

module.exports = router