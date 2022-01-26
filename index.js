//IMPORTS
const express = require('express')
const path = require('path')
const mongoose = require('mongoose')
const session = require('express-session')
const expressValidator = require('express-validator')
const connectDb = require('./config/database')
const passport = require('passport')

//connecting to db
connectDb()

//init app
const app = express()

//MODELS
const Article = require('./models/article')

//set view engine
app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'pug')

//MIDDLEWARES

//bodyparser
app.use(express.urlencoded({ extended: false }))
app.use(express.json())

//public folder
app.use(express.static(path.join(__dirname, 'public')))

//session middleware
app.use(session({
    secret: 'keyboard cat',
    resave: true,
    saveUninitialized: true
}))

//express messages middleware
app.use(require('connect-flash')())
app.use((req, res, next) => {
    res.locals.messages = require('express-messages')(req, res)
    next()
})

//express validator middleware
app.use(expressValidator({
    errorFormatter: (param, msg, value) => {
        const namespace = param.split('.')
        const root = namespace.shift()
        let formParam = root

        while (namespace.length) {
            formParam += '[' + namespace.shift() + ']'
        }

        return {
            param: formParam,
            msg: msg,
            value: value
        }
    }
}))

//passport config
require('./middleware/passport')(passport)
app.use(passport.initialize())
app.use(passport.session())

//ROUTES

app.get('*', (req, res, next) => {
    res.locals.user = req.user || null
    next()
})

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

//articles router
app.use('/articles', require('./routes/articles'))

//users router
app.use('/users', require('./routes/users'))

//server listen
app.listen(3000, () => console.log('Server started on port 3000...'))