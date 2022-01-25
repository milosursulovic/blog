//imports
const express = require('express')
const path = require('path')

//init app
const app = express()

//set view engine
app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'pug')

//routes
app.get('/', (req, res) => {
    const articles = [
        {
            id: 1,
            title: 'Article One',
            author: 'Author 1',
            body: 'Body One'
        },
        {
            id: 2,
            title: 'Article Two',
            author: 'Author 2',
            body: 'Body Two'
        },
        {
            id: 3,
            title: 'Article Three',
            author: 'Author 3',
            body: 'Body Three'
        }
    ]
    res.render('index', {
        title: 'Articles',
        articles: articles
    })
})

app.get('/articles/add', (req, res) => {
    res.render('add_article', {
        title: 'Add Articles'
    })
})

//server listen
app.listen(3000, () => console.log('Server started on port 3000...'))