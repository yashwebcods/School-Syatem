const nodemailer = require('nodemailer')
const FacultyModel = require('../../../model/FacultyModel')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

const passwordGeneraator = () => {
    let passwordString = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@#$&"
    let password = ''
    for (i = 0; i <= 5; i++) {
        password += passwordString[Math.floor(Math.random() * passwordString.length)]
    }
    return password
}

module.exports.AddFaculty = async (req, res) => {
    try {
        let password = passwordGeneraator();
        let isExist = await FacultyModel.findOne({ email: req.body.email })
        if (!isExist) {
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
                from: "ysiddhapura6@gmail.com",
                to: req.body.email, // sender address
                subject: "Hello From SS Shcool System ✔",
                text: `Your Login Details `,
                html: `<br> Your email :- ${req.body.email} <br> Your    password ${password} `,
            });
            let HashPassword = await bcrypt.hash(password, 10)
            req.body.password = HashPassword

            let isAdded = await FacultyModel.create(req.body)
            if (isAdded) {
                let Data = await FacultyModel.findById(isAdded.id)
                return res.status(400).json({ mes: 'Faculty Added', Data: Data })
            } else {
                return res.status(400).json({ mes: 'Faculty not Added' })
            }

        } else {
            return res.status(400).json({ mes: 'Faculty not found' })
        }

    } catch (err) {
        return res.status(400).json({ mes: 'something wrong' })
    }
}

module.exports.Login = async (req, res) => {
    try {
        let isExist = await FacultyModel.findOne({ email: req.body.email })
        if (isExist) {
            let password = await bcrypt.compare(req.body.password, isExist.password)
            if (password) {
                let Token = jwt.sign({
                    email: req.body.email,
                    id: isExist.id
                }, 'Facultysecret')
                return res.status(200).json({ mes: `welcome To YK Shcool System as Faculty ${req.body.email}`, facultyToken: Token })
            } else {
                return res.status(400).json('password is wrong')
            }
        } else {
            return res.status(400).json('faculty not exist')
        }
    } catch (err) {
        return res.status(400).json({ mes: 'something wrong' })
    }
}

module.exports.FacultyProfile = async (req, res) => {
    try {
        let facultyData = await FacultyModel.findById(req.user.id)
        return res.status(200).json({ mes: 'Facultu Data', Data: facultyData })
    } catch (err) {
        return res.status(400).json({ mes: 'something wrong' })
    }
}

module.exports.EditProfile = async (req, res) => {
    try {
        let facultyData = await FacultyModel.findOne({ email: req.user.email })

        if (facultyData) {
            console.log(facultyData._id);
            let isUpdate = await FacultyModel.findByIdAndUpdate(facultyData.id, req.body)

            if (isUpdate) {
                let data = await FacultyModel.findById(isUpdate.id)
                return res.status(200).json({ mes: 'Data Updated Success', Dats: data })
            } else {
                return res.status(200).json({ mes: 'Data Updated Faild' })
            }
        } else {
            return res.status(400).json({ mes: 'Record not found' })
        }
    } catch (err) {
        return res.status(400).json({ mes: 'something wrong' })
    }
}

module.exports.changePassword = async (req, res) => {
    try {
        let FacultuData = await FacultyModel.findById(req.user.id)
        if (FacultuData) {
            let passwordRight = await bcrypt.compare(req.body.currentPassword, FacultuData.password)
            if (passwordRight) {
                if (req.body.newPassword != req.body.currentPassword) {
                    if (req.body.newPassword == req.body.confirmPassword) {
                        let UpdatedPassword = await bcrypt.hash(req.body.confirmPassword, 10)
                        if (UpdatedPassword) {
                            let updatePassword = await FacultyModel.findByIdAndUpdate(FacultuData.id, { password: UpdatedPassword })
                            return res.status(200).json({ mes: 'Password Change Success' })
                        } else {
                            return res.status(200).json({ mes: 'Password Change Faild' })
                        }
                    } else {
                        return res.status(400).json({ mes: 'Your New Password and Confirm password are not Same' })
                    }
                } else {
                    return res.status(400).json({ mes: 'Your New Current and New password are same' })
                }
            } else {
                return res.status(400).json({ mes: 'Your Current Password is wrong' })
            }
        } else {
            return res.status(400).json({ mes: 'Record not found' })
        }
    } catch (err) {
        return res.status(400).json({ mes: 'Something wrong' })
    }
}

module.exports.CheckEmailAndSentOTP = async (req, res) => {
    try {
        let isExist = await FacultyModel.findOne({ email: req.body.email })
        let otp = Math.floor(Math.random() * 10000)
        if (isExist) {
            const transporter = nodemailer.createTransport({
                host: "smtp.gmail.com",
                port: 587,
                secure: false, // true for port 465, false for other ports
                auth: {
                    user: "ysiddhapura6@gmail.com",
                    pass: "yvjbqvvvylugcsrx",
                },
                tls: {
                    rejectUnauthorized: false
                }
            });

            const info = await transporter.sendMail({
                from: 'ysiddhapura6@gmail.com',
                to: req.body.email,
                subject: "YK school Syatem Verify Your Email",
                text: "Your otp ",
                html: `${otp}`,
            });
            if (info) {
                return res.status(200).json({ mes: 'otp sent on given email' })
            } else {
                return res.status(400).json({ mes: 'please check your email and try again' })
            }
        } else {
            return res.status(400).json({ mes: 'Record not Found' })
        }
    } catch (err) {
        return res.status(400).json({ mes: 'Something wrong' })
    }
}

module.exports.changrPassword = async (req, res) => {
    try {
        let FacultyData = await FacultyModel.findById(req.user.id)
        if (FacultyData) {
            if (req.body.newPassword == req.body.confirmPassword) {
                let Newpassword = await bcrypt.hash(req.body.newPassword, 10)
                let isUpdate = await FacultyModel.findByIdAndUpdate(req.user.id, { password: Newpassword })
                if (isUpdate) {
                    return res.status(400).json({ mes: 'Password is Updated' })
                } else {
                    return res.status(400).json({ mes: 'Password updated Faild' })
                }
            } else {
                return res.status(400).json({ mes: 'your new password and confirm password is not same' })
            }
        } else {
            return res.status(400).json({ mes: 'Record not Found' })
        }
    } catch (err) {
        return res.status(400).json({ mes: 'Something wrong' })
    }
}