//imports
const express = require('express')
const path = require('path')
const mongoose = require('mongoose')

//connecting to db
mongoose.connect('mongodb://localhost/blog')

//connect to db once
const db = mongoose.connection
db.once('open', () => console.log('Connected to MongoDB...'))

//check for db errors
db.on('error', error => console.log(error))

//init app
const app = express()

//models
const Article = require('./models/article')

//set view engine
app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'pug')

//routes

//get articles router, fetch from db
app.get('/', (req, res) => {
    Article.find({}, (error, articles) => {
        if (error) console.log(error)
        else {
            res.render('index', {
                title: 'Articles',
                articles: articles
            })
        }
    })
})

//add article route
app.get('/articles/add', (req, res) => {
    res.render('add_article', {
        title: 'Add Articles'
    })
})

//server listen
app.listen(3000, () => console.log('Server started on port 3000...'))