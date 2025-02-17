const express = require('express')
const route = express.Router()
const FacultyCtl = require('../../../../controller/api/v1/FacultyCtl')
const passport = require('passport')

route.post('/' , passport.authenticate('jwt',{failureRedirect:'/loginFaild'}) , FacultyCtl.AddFaculty)
route.post('/login',  FacultyCtl.Login)

route.get('/profile' , passport.authenticate('faculty',{failureRedirect:'/loginFaild'}) , FacultyCtl.FacultyProfile)

route.put('/editProfile' ,  passport.authenticate('faculty',{failureRedirect:'/loginFaild'}) ,FacultyCtl.EditProfile)

route.post('/changePass' ,  passport.authenticate('faculty',{failureRedirect:'/loginFaild'}) ,
FacultyCtl.changePassword)

route.post('/emailCheck' , passport.authenticate('faculty',{failureRedirect:'/loginFaild'}) , FacultyCtl.CheckEmailAndSentOTP)

route.post('/changeForgetedPass' , passport.authenticate('faculty',{failureRedirect:'/loginFaild'}) , FacultyCtl.changrPassword)


module.exports = route
