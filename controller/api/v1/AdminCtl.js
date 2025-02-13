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
            let password = bcrypt.compare(req.body.password, isAdmin.password)
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

module.exports.AdminProfile = async (req, res) => {
    try {
        let ProfileData = await AdminModel.findById(req.user._id)
        console.log(ProfileData, "with profile");
        if (ProfileData) {
            return res.status(200).json({ mes: 'ProfileData', Data: ProfileData })
        } else {
            return res.status(200).json({ mes: "Record Not Found" })
        }
    } catch (err) {
        return res.status(400).json({ mes: "Somthing Wrong" })
    }
}

module.exports.eidtAdminProfile = async (req, res) => {
    try {
        console.log(req.body);
        let id = req.params.id

        let ProfileData = await AdminModel.findById(id)
        if (ProfileData) {
            let Updated = await AdminModel.findByIdAndUpdate(id, req.body)
            let isUpdated = await AdminModel.findById(id)
            res.status(200).json({ mes: 'Profile Update ', Data: isUpdated })
        } else {
            res.status(200).json({ mes: "Record Not Found" })
        }
    } catch (err) {
        return res.status(400).json({ mes: "Somthing Wrong" })
    }
}

module.exports.ChangePassword = async (req, res) => {
    try {

        let AdminData = await AdminModel.findById(req.user._id)
        console.log(AdminData);
        if (AdminData) {
            let checkPassword = await bcrypt.compare(req.body.currentpassword, AdminData.password)
            if (checkPassword) {
                if (req.body.currentpassword != req.body.newPassword) {

                    if (req.body.newPassword == req.body.confirmPassword) {



                        
                        req.body.newPassword = bcrypt.hash(req.body.confirmPassword, 10)
                        let newData = await AdminModel.findByIdAndUpdate(req.user._id, req.body)
                        if (newData) {
                            
                            let data = await AdminModel.findById(req.user._id)
                            return res.status(200).json({ mes: "password change success", Data: data })
                        } else {
                            return res.status(200).json({ mes: "password change faild" })
                        }
                    } else {
                        return res.status(200).json({ mes: "new password and confirm password is not same" })
                    }
                } else {
                    return res.status(200).json({ mes: "new password and current password is same" })

                }
            } else {
                return res.status(200).json({ mes: "your current password is wrong" })
            }
        } else {
            return res.status(200).json({ mes: "Record Not Found" })
        }


    } catch (err) {
        return res.status(400).json({ mes: "Somthing Wrong" })

    }
}