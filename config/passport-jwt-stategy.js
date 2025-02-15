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