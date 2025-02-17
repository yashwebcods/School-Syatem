const AdminModel = require('../../../model/AdminModel')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const nodemailer = require('nodemailer')


module.exports.register = async (req, res) => {
    try {
        let isExist = await AdminModel.findOne({ email: req.body.email });

        if (!isExist) {
            if (req.body.confirmPassword === req.body.password) {
                req.body.password = await bcrypt.hash(req.body.password, 10);

                if (req.body.password) {
                    let isAdded = await AdminModel.create(req.body);
                    return res.status(201).json({ mes: "Admin Added", Data: isAdded });
                } else {
                    return res.status(500).json({ mes: "Admin Not Added" });
                }
            } else {
                return res.status(400).json({ mes: "Password does not match" });
            }
        } else {
            return res.status(409).json({ mes: "Email already exists" });
        }
    } catch (err) {
        return res.status(500).json({ mes: "Something went wrong", error: err.message });
    }
};

module.exports.Login = async (req, res) => {
    try {
        let isAdmin = await AdminModel.findOne({ email: req.body.email })
        if (isAdmin) {
            let password = await bcrypt.compare(req.body.password, isAdmin.password)
            if (password) {

                let adminToken = jwt.sign({
                    email: req.body.email,
                    id: isAdmin.id
                }, 'secret')
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
        let ProfileData = await AdminModel.findById(req.user.id)
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
        let id = req.user.id

        let ProfileData = await AdminModel.findById(id)
        if (ProfileData) {
            let Updated = await AdminModel.findByIdAndUpdate(id, req.body)
            res.status(200).json({ mes: 'Profile Update', Data: Updated })
        } else {
            res.status(200).json({ mes: "Record Not Found" })
        }
    } catch (err) {
        return res.status(400).json({ mes: "Somthing Wrong" })
    }
}

module.exports.ChangePassword = async (req, res) => {
    try {

        let AdminData = await AdminModel.findById(req.user.id)
        if (AdminData) {
            let checkPassword = await bcrypt.compare(req.body.currentpassword, AdminData.password)

            if (checkPassword) {
                if (req.body.currentpassword != req.body.newPassword) {

                    if (req.body.newPassword == req.body.confirmPassword) {

                        cryptPassword = await bcrypt.hash(req.body.confirmPassword, 10)

                        if (newData) {
                            let data = await AdminModel.findById(req.user.id)
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

module.exports.forgetPassword = async (req, res) => {
    try {
        let isAdmin = await AdminModel.findOne({ email: req.body.email })
        let otp = Math.round(Math.random() * 10000)
        if (isAdmin) {
            const transporter = nodemailer.createTransport({
                host: "smtp.gmail.com",
                port: 587,
                secure: false,
                auth: {
                    user: "ysiddhapura6@gmail.com",
                    pass: "yvjbqvvvylugcsrx",
                }, tls: {
                    rejectUnauthorized: false
                }
            });

            const info = await transporter.sendMail({
                from: "ysiddhapura6@gmail.com", // list of receivers
                to: req.body.email, // sender address
                subject: "Hello ✔", // Subject line
                text: `Your Otp`, // plain text body
                html: `${otp}`, // html body
            });
        } else {
            return res.status(400).json({ mes: "invalid email" })

        }
    } catch (err) {
        return res.status(400).json({ mes: "Somthing Wrong" })
    }
}

module.exports.forgGetPass = async (req, res) => {
    try {
        
        let Data = await AdminModel.findById(req.user.id)

        if (req.body.newpassword == req.body.confirmpassword) {
            let password = await bcrypt.hash(req.body.newpassword, 10)
            if (password) {
                await AdminModel.findByIdAndUpdate(req.user.id, { password: password })
                return res.status(400).json({ mes: 'Password Change success' })

            } else {
                return res.status(400).json({ mes: 'Password not Secure' })
            }
        } else {
            return res.status(400).json({ mes: "New Password And Confirm Password Must Be Same" })
        }
    } catch (err) {
        return res.status(400).json({ mes: "Somthing Wrong" })
    }
}