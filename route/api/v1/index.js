const express = require('express')
const route = express.Router()
const AdminCtl = require('../../../controller/api/v1/AdminCtl')
const passport = require('passport')

route.get('/loginFaild', (req,res)=> {
    try {
        return res.status(200).json({mes:'Your Not Authenticated'})
    } catch (error) {
        return res.status(200).json({mes:'Something Wrong'})
    }
}) 
route.post('/', AdminCtl.register)
route.post('/login' , AdminCtl.Login)
route.get('/adminProfile', passport.authenticate('jwt',{failureRedirect:'/loginFaild'}) , AdminCtl.AdminProfile)
route.patch('/editAdminProfile/:id' ,passport.authenticate('jwt',{failureRedirect:'/loginFaild'}) , AdminCtl.eidtAdminProfile)
route.patch('/changePassword' , passport.authenticate('jwt',{failureRedirect:'/loginFaild'}) , AdminCtl.ChangePassword)
route.post('/forgetpassword' , passport.authenticate('jwt',{failureRedirect:'/loginFaild'}) , AdminCtl.forgetPassword)
route.patch('/changeOldPassword' , passport.authenticate('jwt',{failureRedirect:'/loginFaild'}), AdminCtl.forgGetPass) 
module.exports = route