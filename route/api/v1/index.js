const express = require('express')
const route = express.Router()
const AdminCtl = require('../../../controller/api/v1/AdminCtl')
const passport = require('passport')

route.post('/', AdminCtl.register)
route.post('/login' , AdminCtl.Login)
route.get('/adminProfile', passport.authenticate('jwt',{failureRedirect:'/AdminLoginFlai'}) , AdminCtl.AdminProfile)
route.get('/AdminLoginFlai', (req,res)=> {
    try {
        return res.status(200).json({mes:'Your Not Authenticated'})
    } catch (error) {
        return res.status(200).json({mes:'Something Wrong'})
    }
}) 
route.patch('/editAdminProfile/:id' ,passport.authenticate('jwt',{failureRedirect:'/AdminLoginFlai'}) , AdminCtl.eidtAdminProfile)
route.patch('/changePassword' , passport.authenticate('jwt',{failureRedirect:'/AdminLoginFlai'}) , AdminCtl.ChangePassword)
route.post('/forgetpassword' , passport.authenticate('jwt',{failureRedirect:'/AdminLoginFlai'}) , AdminCtl.forgetPassword)
route.patch('/changeOldPassword' , AdminCtl.forgGetPass) 
module.exports = route