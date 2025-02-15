const mongoose  = require('mongoose')

const FacultuSchema = mongoose.Schema({
    AdminId:{
        type:mongoose.Schema.Types.ObjectId,
        require:true
    },
    FacultyName:{
        type:String,
        require:true
    },
    email:{
        type:String,
        require:true
    },
    password:{
        type:String,
        required:true
    },
    status:{
        type:Boolean,
        default:true
    },
},{
    timestamps:true
})

const Faculty = mongoose.model('Faculty',FacultuSchema)

module.exports = Faculty