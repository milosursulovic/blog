//imports
const express = require('express')
const path = require('path')
const mongoose = require('mongoose')

//connecting to db
mongoose.connect('mongodb://localhost/blog', {
    useNewUrlParser: true,
    useUnifiedTopology: true
})

//connect to db once
const db = mongoose.connection
db.once('open', () => console.log('Connected to MongoDB...'))

//check for db errors
db.on('error', error => console.log(error))

//init app
const app = express()

//MODELS
const Article = require('./models/article')

//set view engine
app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'pug')

//MIDDLEWARES

//bodyparser
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

//public folder
app.use(express.static(path.join(__dirname, 'public')))

//ROUTES

//render articles, fetching from db
app.get('/', (req, res) => {
    Article.find({}, (error, articles) => {
        if (error) {
            console.log(error)
            return
        }
        res.render('index', {
            title: 'Articles',
            articles: articles
        })
    })
})

//render single article
app.get('/article/:id', (req, res) => {
    Article.findById(req.params.id, (error, article) => {
        res.render('article', {
            article: article
        })
    })
})

//render add article page
app.get('/articles/add', (req, res) => {
    res.render('add_article', {
        title: 'Add Articles'
    })
})

//save article to db
app.post('/articles/add', (req, res) => {
    const article = new Article()
    article.title = req.body.title
    article.author = req.body.author
    article.body = req.body.body

    article.save(error => {
        if (error) {
            console.log(error)
            return
        }
        res.redirect('/')
    })
})

//render edit form
app.get('/article/edit/:id', (req, res) => {
    Article.findById(req.params.id, (error, article) => {
        res.render('edit_article', {
            title: 'Edit article',
            article: article
        })
    })
})

//edit article logic
app.post('/articles/edit/:id', (req, res) => {
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
        res.redirect('/')
    })
})

//delete article
app.delete('/articles/:id', (req, res) => {
    const query = { _id: req.params.id }
    Article.remove(query, error => {
        if (error) {
            console.log(error)
            return
        }
        res.send('Success')
    })
})

//server listen
app.listen(3000, () => console.log('Server started on port 3000...'))