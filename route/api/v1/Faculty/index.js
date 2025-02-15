const express = require('express')
const route = express.Router()
const FacultyCtl = require('../../../../controller/api/v1/FacultyCtl')
const passport = require('passport')

route.post('/' , passport.authenticate('jwt',{failureRedirect:'/AdminLoginFlai'}) , FacultyCtl.AddFaculty)

module.exports = route
