const mongoose = require('mongoose')

mongoose.connect('mongodb://127.0.0.1:27017/advanceAuth', { useCreateIndex: true, useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false }).then(() => {
    console.log('Database connected ')
}).catch((e) => {
    console.log(e.message)
})