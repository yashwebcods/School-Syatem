const express = require('express')
const app = express()
const port = 8001

const db = require('./config/mogoose')

app.use(express.urlencoded())

app.use('/' , require('./route/api/v1'))

app.listen(port, (err) => {
    if (err) {
        console.log(err);
        return false
    }
    console.log('server connected on : ' + port);
})