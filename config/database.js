//IMPORTS
const mongoose = require('mongoose');

//DEFINING CONNECTION
const connectDb = async () => {
    const conn = await mongoose.connect('mongodb://localhost/blog', {
        useNewUrlParser: true,
        useCreateIndex: true,
        useFindAndModify: false,
        useUnifiedTopology: true
    })

    console.log(`MongoDB Connected...`)
};

module.exports = connectDb;