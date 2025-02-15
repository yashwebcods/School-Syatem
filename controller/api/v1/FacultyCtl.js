const passwordGeneraator = () => {
    let passwordString = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@#$&"
    let password = ''
    for (i = 0; i <= 5; i++) {
        password += passwordString[Math.floor(Math.random() * passwordString.length)]
    }
    return password
}
const nodemailer = require('nodemailer')
const FacultyModel = require('../../../model/FacultyModel')
const bcrypt = require('bcrypt')

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