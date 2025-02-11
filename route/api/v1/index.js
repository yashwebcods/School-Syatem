const express = require('express')
const route = express.Router()
const AdminCtl = require('../../../controller/api/v1/AdminCtl')

route.post('/', AdminCtl.register)
route.post('/login' , AdminCtl.Login)

module.exports = route