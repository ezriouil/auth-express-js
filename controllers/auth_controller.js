const Joi = require('joi')
const joiPasswordComplexity = require('joi-password-complexity');
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken');
const nodeMailer = require('nodemailer')
const REQUEST_CODES = require('../utils/request_codes')
const User = require('../models/User');
const { emailTemplateSendVerificationLink, emailTemplateSendOTPCode } = require('../utils/email_templates');


/* ==>  REGISTER NEW USER  <== */
const register = async (req, res) => {

  try {
    
    const validateRegister = Joi.object({
      userName : Joi.string().trim().min(3).max(99).required(),
      email : Joi.string().trim().min(6).required(),
      password : joiPasswordComplexity().required(),
    });
    const { error } = validateRegister.validate(req.body);
    if(error){
      return res.status(REQUEST_CODES.BAD_REQUEST).json({ message : error.details[0].message });
    }

    let user = await User.findOne({ email : req.body.email });

    if(user){
      if(!user.verified){
        return res.status( REQUEST_CODES.BAD_REQUEST ).json({ message : 'Your Account Not Verified' });
      }
      return res.status( REQUEST_CODES.BAD_REQUEST ).json({ message : 'This User Already Registred' });
    }

    const salt = await bcrypt.genSalt(10);
    const passwordHashed = await bcrypt.hash(req.body.password, salt);
    req.body.password = passwordHashed;

    user = new User();
    user.userName = req.body.userName;
    user.email = req.body.email;
    user.password = req.body.password;

    const result = await user.save();  
    const { password, isAdmin, verified, otpCode, __v, ...other } = result._doc;

    const token = jwt.sign({ email : user.email, id : user._id }, process.env.JWT_SECRET_KEY)
    const link = `https://sparkling-rose-hosiery.cyclic.app:8000/api/auth/verify-user-account/${token}`;

    const transporter = nodeMailer.createTransport({
            service : "gmail",
            auth : { user : process.env.EMAIL, pass : process.env.PASSWORD }
          })
      
          const mailOptions = {
            from : process.env.EMAIL,
            to : user.email,
            subject : "Verify account",
            html : emailTemplateSendVerificationLink(link,req.body.userName)
          }
      
          transporter.sendMail(mailOptions, async (error, success) => {
            if(error){

              user.verified = true;
              await user.save();
              
            }
          });

          return res.status(REQUEST_CODES.CREATED).json({...other});
    

  } catch (error) {console.log(error);
    
    return res.status(REQUEST_CODES.SERVER_ERROR).json({ message : 'Something Went Wrong' });
    
  }
};


/* ==>  LOGIN USER  <== */
const login = async (req, res) => {

  try {
   
    const validLogin = Joi.object({
      email : Joi.string().trim().min(6).required(),
      password : Joi.string().trim().min(6).required(),
    });
    const { error } = validLogin.validate(req.body);
    if(error){
      return res.status(REQUEST_CODES.BAD_REQUEST).json({ message : error.details[0].message });
    }

    let user = await User.findOne({ email : req.body.email });

    if(!user){
      return res.status( REQUEST_CODES.BAD_REQUEST ).json({ message : 'Invalid Email or Password' });
    }

    if(!user.verified){
      return res.status( REQUEST_CODES.BAD_REQUEST ).json({ message : 'Your Account Not Verified' });
    }

    const isPasswordMatch = await bcrypt.compare(req.body.password, user.password);
    if(!isPasswordMatch){
      return res.status(REQUEST_CODES.BAD_REQUEST).json({ message : 'Invalid Email or Password' });
    }

    const token = jwt.sign({ id : user._id, isAdmin : user.isAdmin }, process.env.JWT_SECRET_KEY);

    user = await User.findOneAndUpdate({ 'email' : req.body.email }, {
      $set : {
        token : token
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


/* ==>  RE SEND EMAIL VERIFICATION LINK  <== */
const reSendEmailVerificationLink = async(req, res) => {

  const validBody = Joi.object({
    email : Joi.string().trim().min(6).required(),
  });
  const { error } = validBody.validate(req.body);
  if(error){
    return res.status(REQUEST_CODES.BAD_REQUEST).json({ message : error.details[0].message });
  }

  const user = await User.findOne({ email : req.body.email });

  if(!user){
    return res.status( REQUEST_CODES.BAD_REQUEST ).json({ message : 'Invalid Email' });
  }

  if(user.verified){
    return res.status( REQUEST_CODES.OK ).json({ message : 'Your Account Already Verified' });
  }

  const token = jwt.sign({ email : user.email, id : user._id }, process.env.JWT_SECRET_KEY)
  const link = `http://localhost:8000/api/auth/verify-user-account/${token}`;

  const transporter = nodeMailer.createTransport({
            service : "gmail",
            auth : {
              user : process.env.EMAIL,
              pass : process.env.PASSWORD }})
      
  const mailOptions = {
            from : process.env.EMAIL,
            to : user.email,
            subject : "Verify account",
            html : emailTemplateSendVerificationLink(link,user.userName)
          }
  transporter.sendMail(mailOptions, async (error, success) => {
    if(error){
      user.verified = true;
      await user.save();
    }
  });
  
  return res.status(REQUEST_CODES.OK).json({message : "Check Your Email"});

};


/* ==>    VERIFY USER ACCOUNT FROM EMAIL LINK  <== */
const verifyUserAccount = async(req, res) => {

  try {

    const decoded = jwt.decode(req.params.token, process.env.JWT_SECRET_KEY);
    
    let user = await User.findOne({ email : decoded.email });
    if(!user){
      return res.status(REQUEST_CODES.BAD_REQUEST).json({message : 'Client Not fFound'});
    }

    if(user.verified){
      return res.status(REQUEST_CODES.BAD_REQUEST).json({message : 'Link Expired'});
    }

    user = await User.findByIdAndUpdate(decoded.id, {
      $set : {
        verified : true,
      }
    }, {
      new : true
    })

    return res.status(REQUEST_CODES.OK).json({message : "Verified Successfully"});
    
    
  } catch (error) {

    return res.status(REQUEST_CODES.SERVER_ERROR).json({ message : 'Something Went Wrong' });
    
  }
}


/* ==>  SEND OTP CODE TO EMAIL USER FOR RESET THE PASSWORD  <== */
const sendOtpCodeResetThePassword = async(req, res) => {
  try {
    
    const validBody = Joi.object({
      email : Joi.string().trim().min(6).required(),
    });
    const { error } = validBody.validate(req.body);
    if(error){
      return res.status(REQUEST_CODES.BAD_REQUEST).json({ message : error.details[0].message });
    }

    const user = await User.findOne({ email : req.body.email });
    if(!user){

      return res.status(REQUEST_CODES.BAD_REQUEST).json({message : 'Client Not Found'});
    
    }
    else{

      if(!user.verified){
        return res.status( REQUEST_CODES.BAD_REQUEST ).json({ message : 'Your Account Not Verified' });
      }
      if(user.otpCode !== null){
        return res.status( REQUEST_CODES.BAD_REQUEST ).json({ message : 'Code OTP Already Sent Check Your Email' });
      }

      const genNewOtpCode = Math.floor(Math.random() * 9000) + 1000;
      await User.findOneAndUpdate( { email : req.body.email } , {
      $set : {
        otpCode : genNewOtpCode.toString(),
      }}, {
      new : true
    })
    const transporter = nodeMailer.createTransport({
      service : "gmail",
      auth : {
        user : process.env.EMAIL,
        pass : process.env.PASSWORD
      }
    })

    const mailOptions = {
      from : process.env.EMAIL,
      to : user.email,
      subject : "OTP code",
      html : emailTemplateSendOTPCode(genNewOtpCode, user.userName, process.env.EMAIL)
    }

    transporter.sendMail(mailOptions, (error, success) => {
      if(success){
        console.log(success.response);
      }else{
        console.log(error);
      }
    })

    return res.status(REQUEST_CODES.OK).json({message : "check your email"});

    }

  } catch (error) {

    return res.status(REQUEST_CODES.SERVER_ERROR).json({message : "Something went wrong"});

  }
}


/* ==>  RE SEND OTP CODE TO EMAIL USER FOR RESET THE PASSWORD  <== */
const reSendOtpCodeResetThePassword = async(req, res) => {
  try {
    
    const validBody = Joi.object({
      email : Joi.string().trim().min(6).required(),
    });
    const { error } = validBody.validate(req.body);
    if(error){
      return res.status(REQUEST_CODES.BAD_REQUEST).json({ message : error.details[0].message });
    }

    const user = await User.findOne({ email : req.body.email });
    if(!user){
      if(!user.verified){
        return res.status( REQUEST_CODES.BAD_REQUEST ).json({ message : 'Your Account Not Verified' });
      }
      return res.status(REQUEST_CODES.BAD_REQUEST).json({message : 'Client Not Found'});
    }

    const transporter = nodeMailer.createTransport({
      service : "gmail",
      auth : {
        user : process.env.EMAIL,
        pass : process.env.PASSWORD
      }
    })

    const mailOptions = {
      from : process.env.EMAIL,
      to : user.email,
      subject : "OTP code",
      html : emailTemplateSendOTPCode(user.otpCode, user.userName, process.env.EMAIL)
    }

    transporter.sendMail(mailOptions, (error, success) => {
      if(success){
        console.log(success.response);
      }else{
        console.log(error);
      }
    })

    return res.status(REQUEST_CODES.OK).json({message : "check your email"});

  } catch (error) {

    return res.status(REQUEST_CODES.SERVER_ERROR).json({message : "Something went wrong"});

  }
}


/* ==>  VERIFICATION OTP CODE  <== */
const verifyOtpCodeResetThePassword = async(req, res) => {
  try {

    const validBody = Joi.object({
      email : Joi.string().trim().min(6).required(),
      code : Joi.string().trim().min(4).max(4).required(),
    });
    const { error } = validBody.validate(req.body);
    if(error){
      return res.status(REQUEST_CODES.BAD_REQUEST).json({ message : error.details[0].message });
    }

    const user = await User.findOne({ email : req.body.email });
    if(!user){
      return res.status(REQUEST_CODES.BAD_REQUEST).json({ message : "Code Expired" });
    }

    if(user.otpCode !== req.body.code){
      return res.status(REQUEST_CODES.BAD_REQUEST).json({ message : "Code Invalid" });
    }

    return res.status(REQUEST_CODES.OK).json({ message : "Code Valid" });
    

  } catch (error) {
    console.log(error);
    return res.status(REQUEST_CODES.SERVER_ERROR).json({message : "Something Went Wrong"});
  }
}


/* ==>  RESET THE PASSWORD  <== */
const resetThePassword = async(req, res) => {
  try {

    const validateBody = Joi.object({
      email : Joi.string().trim().min(6).required(),
      newPassword : joiPasswordComplexity().required(),
    });
    const { error } = validateBody.validate(req.body);
    if(error){
      return res.status(REQUEST_CODES.BAD_REQUEST).json({ message : error.details[0].message });
    }

    let user = await User.findOne({ email : req.body.email });
    if(!user){
      return res.status(REQUEST_CODES.BAD_REQUEST).json({ message : "User Not Found !" });
    }

    if(user.otpCode === null){
      return res.status(REQUEST_CODES.BAD_REQUEST).json({ message : "You Are Not Allowed !" });
    }

    const salt = await bcrypt.genSalt(10);
    const passwordHashed = await bcrypt.hash(req.body.newPassword, salt);

    user = await User.findOneAndUpdate({ 'email' : req.body.email }, {
      $set : {
        password : passwordHashed,
        otpCode : null
      }
    }, {
      new : true
    })

    return res.status(REQUEST_CODES.OK).json({ message : "password Updated Successfully" });
    

  } catch (error) {
    console.log(error);
    return res.status(REQUEST_CODES.SERVER_ERROR).json({message : "Something Went Wrong"});
  }
}


module.exports = {
  register,
  login,
  reSendEmailVerificationLink,
  verifyUserAccount,
  sendOtpCodeResetThePassword,
  reSendOtpCodeResetThePassword,
  verifyOtpCodeResetThePassword,
  resetThePassword
};