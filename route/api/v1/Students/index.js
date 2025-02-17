const express = require('express')
const route = express.Router()
const StudentCtl = require('../../../../controller/api/v1/StudentCtler')
const passport = require('passport')

route.post('/' , passport.authenticate('faculty',{failureRedirect:'/loginFaild'}) , StudentCtl.AddStudent)

route.post('/login' , StudentCtl.loginStudent)
module.exports = route
