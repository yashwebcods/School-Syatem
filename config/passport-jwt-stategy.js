const passport = require('passport')
const passportJwt = require('passport-jwt').Strategy
const ExJwt = require('passport-jwt').ExtractJwt

const AdminModel = require('../model/AdminModel')

const opts = {
    jwtFromRequest: ExJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: 'secret'
}

passport.use(new passportJwt(opts, async function (payload, done) {
    let AdminData = await AdminModel.findOne({ email: payload.email })
    console.log(payload);
    
    if (AdminData) {
        return done(null, AdminData)
    } else {
        return done(null, false)
    }
}))


const opts2 = {
    jwtFromRequest: ExJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: 'Facultysecret'
}
const facultyModel = require('../model/FacultyModel')

passport.use('faculty',new passportJwt(opts2, async function (payload, done) {
    let facultyData = await facultyModel.findOne({ email: payload.email })
    console.log(payload);
    
    if (facultyData) {
        return done(null, facultyData)
    } else {
        return done(null, false)
    }
}))


const opts3 = {
    jwtFromRequest: ExJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: 'studentSecret'
}

const studentModel = require('../model/StudentModel')

passport.use('student',new passportJwt(opts3, async function (payload, done) {
    let StudenData = await studentModel.findOne({ email: payload.email })
    console.log(payload);
    
    if (StudenData) {
        return done(null, StudenData)
    } else {
        return done(null, false)
    }
}))

passport.serializeUser(function(user,done){
    return done(null,user.id)
})

passport.deserializeUser(async function(id,done){
    let isAdmin = await AdminModel.findById(id)
    if(isAdmin){
        return done(null,isAdmin)
    }else{
        return done(null , false)
    }
})

module.exports = passport