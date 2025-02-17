const nodemailer = require('nodemailer')
const StudentModel = require('../../../model/StudentModel')
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

module.exports.AddStudent = async (req, res) => {
  try {
    console.log(req.body);
    let isExist = await StudentModel.findOne({ email: req.body.email })
    let password = passwordGeneraator()
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
        to: req.body.email,
        subject: "Hello From SS Shcool System ✔",
        text: `Your Login Details `,
        html: `<br> Your email :- ${req.body.email} <br> Your password :- ${password} `,
      });
      console.log('hi');
      if (info) {
        let password = passwordGeneraator()
        let HashPassword = await bcrypt.hash(password,10) 
        req.body.password = HashPassword
        let isAdded = await StudentModel.create(req.body)
        if (isAdded) {
          return res.status(200).json({ mes: 'Studen Added Success' })
        } else {
          return res.status(200).json({ mes: 'Studen Added Success' })
        }
        return res.status(200).json({ mes: 'email sent on given email' })
      } else {
        return res.status(200).json({ mes: 'email not sent' })
      }
    } else {
      return res.status(200).json({ mes: 'Email already exist' })
    }
  } catch (err) {
    return res.status(400).json({ mes: 'something wrong' })
  }
}

module.exports.loginStudent = async (req, res) => {
  try {
    let isExist = await StudentModel.findOne({ email: req.body.email })
    if (isExist) {
      let isPasswordRight = await bcrypt.compare(req.body.password,isExist.password)
      if(isPasswordRight){
        let Token = jwt.sign({
          email:req.body.email,
          id:isExist.id
        },'studentSecret')
        return res.status(400).json({ mes: 'Student Login Success',Data:Token})
      }else{
        return res.status(400).json({ mes: 'Password is wrong'})
      }
    } else {
      return res.status(400).json({ mes: 'Recod not found' })
    }
  } catch (err) {
    return res.status(400).json({ mes: 'something wrong', error: err })
  }
}