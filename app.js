const express = require('express')
const app = express()
const port = 8001
const db = require('./config/mogoose')

app.use(express.urlencoded())
const passport = require('passport')
const jetStatery = require('./config/passport-jwt-stategy')
const session = require('express-session')

app.use(session({
    name:'user',
    secret:'secret',
    resave:false,
    saveUninitialized:false,
    cookie:{
        maxAge:1000*60*60
    }
}))

app.use(passport.initialize())
app.use(passport.session())

app.use('/' , require('./route/api/v1'))
app.use('/faculty' , require('./route/api/v1/Faculty'))
app.use('/student' , require('./route/api/v1/Students'))

app.listen(port, (err) => {
    if (err) {
        console.log(err);
        return false
    }
    console.log('server connected on : ' + port);
})