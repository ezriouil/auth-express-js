const Joi = require('joi')
const joiPasswordComplexity = require('joi-password-complexity');
const bcrypt = require('bcrypt')
const REQUEST_CODES = require('../utils/request_codes')
const User = require('../models/User')

/* ==>  Update User By Id  <== */
const updateUserById = async (req, res) => {

  try {
    
    const validateRegister = Joi.object({
      userName : Joi.string().trim().min(3).max(99),
      password : joiPasswordComplexity().required(),
    });
    const { error } = validateRegister.validate(req.body);
    if(error){
      return res.status(REQUEST_CODES.BAD_REQUEST).json({ message : error.details[0].message });
    }

    if(req.body.password != undefined){
      const salt = await bcrypt.genSalt(10);
      const passwordHashed = await bcrypt.hash(req.body.password, salt);
      req.body.password = passwordHashed;
    }

    const user  = await User.findByIdAndUpdate(req.params.id, {
      $set : {
        userName : req.body.userName,
        password : req.body.password
      }
    }, {
      new : true
    })

    const { password, isAdmin, verified, otpCode, __v, ...other } = user._doc;

    return res.status(REQUEST_CODES.OK).json({...other});


  } catch (error) {
    
    return res.status(REQUEST_CODES.SERVER_ERROR).json({ message : 'Something Went Wrong' });

  }

};


module.exports = updateUserById;