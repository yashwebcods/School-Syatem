const AdminModel = require('../../../model/AdminModel')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

module.exports.register = async (req, res) => {
    try {
        let isExist = await AdminModel.findOne({ email: req.body.email })
        if (!isExist) {
            if (req.body.confirmPassword == req.body.password) {
                req.body.password = await bcrypt.hash(req.body.password, 10)
                let isAdded = await AdminModel.create(req.body)
                if (isAdded) {
                    return res.status(200).json({ mes: "Admin Added" })

                } else {
                    return res.status(200).json({ mes: "Admin Not Add" })
                }
            } else {
                return res.status(200).json({ mes: "Password is wrong" })
            }
        }
        else {
            return res.status(200).json({ mes: "Email already exist" })
        }
    } catch (err) {
        return res.status(400).json({ mes: "Somthing Wrong" })
    }
}

module.exports.Login = async (req, res) => {
    try {
        let isAdmin = await AdminModel.findOne({ email: req.body.email })
        if (isAdmin) {
            let password = bcrypt.compare(req.body.password,isAdmin.password)
            if (password) {
               
                
                let adminToken = jwt.sign({ admintoken: isAdmin }, 'secret')
                return res.status(200).json({ mes: "Admin login Success", adminToken })
            } else {
                return res.status(200).json({ mes: "Invalid Password" })
            }
        } else {
            return res.status(200).json({ mes: "Invalid Email" })
        }
    } catch (err) {
        return res.status(400).json({ mes: "Somthing Wrong" })
    }
}