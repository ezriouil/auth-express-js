const mongoose = require('mongoose');

/*________________ SCHEMA OF USER TABLE INSIDE DB ________________*/
const UserSchema = new mongoose.Schema({
  userName : {
    type : String,
    required : true,
    trim : true,
    minLength:3
  },
  email : {
    type : String,
    required : true,
    unique:true,
    trim : true,
    minLength : 6,
  },
  password : {
    type : String,
    required : true,
    trim : true,
    minLength : 6,
  },
  isAdmin: {
    type : Boolean,
    default : false
  },
  verified: {
    type : Boolean,
    default : false
  },
  otpCode: {
    type : String,
    allowNull : true
  },
  token: {
    type : String,
    allowNull : true
  }
},
{ timestamps : true }
);

const User = mongoose.model('user', UserSchema);

module.exports = User;