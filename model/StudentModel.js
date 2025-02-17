const mongoose  = require('mongoose')

const StudentSchema = mongoose.Schema({
    AdminId:{
        type:mongoose.Schema.Types.ObjectId,
        require:true
    },
    StudentName:{
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

const Student = mongoose.model('Student',StudentSchema)

module.exports = Student