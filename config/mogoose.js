const mongoose = require('mongoose')
const db = mongoose.connect('mongodb+srv://ysiddhapura6:MCcsIdXQDxBOtWeK@cluster0.2mi8v.mongodb.net/SchoolSystem')
if(db){
    console.log('db is connecte');
}else{
    console.log('db is not connecte');
}

module.exports = db