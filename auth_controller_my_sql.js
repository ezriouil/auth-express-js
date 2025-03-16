// const bcrypt = require("bcrypt");
// const jwt = require("jsonwebtoken");
// const nodeMailer = require("nodemailer");
// const db = require("../config/db");
// const joi = require("joi");
// const joiPasswordComplexity = require("joi-password-complexity");
// const REQUEST_CODES = require("../utils/request_codes");
// const { emailTemplateSendOTPCode } = require("../utils/email_templates");

// /* ==> REGISTER NEW USER <== */
// const register = async (req, res) => {
//   try {
//     const validator = joi.object({
//       fullName: joi.string().trim().min(3).max(99).required(),
//       email: joi.string().trim().min(6).required(),
//       password: joiPasswordComplexity().required(),
//     });
//     const { error } = validator.validate(req.body);
//     if (error) {
//       return res
//         .status(REQUEST_CODES.BAD_REQUEST)
//         .json({ message: error.details[0].message });
//     }

//     db.query(
//       "SELECT email FROM users WHERE email = ?",
//       [req.body.email],
//       async (error, result) => {
//         if (error) {
//           return res
//             .status(REQUEST_CODES.SERVER_ERROR)
//             .json({ message: "Something Went Wrong" });
//         }

//         if (result.length > 0) {
//           return res
//             .status(REQUEST_CODES.BAD_REQUEST)
//             .json({ error: "Email already used before !" });
//         }

//         const salt = await bcrypt.genSalt(10);
//         const passwordHashed = await bcrypt.hash(req.body.password, salt);
//         req.body.password = passwordHashed;

//         db.query(
//           "INSERT INTO users (fullName, email, password, isVerified, isAdmin) VALUES (?, ?, ?, ?, ?)",
//           [req.body.fullName, req.body.email, req.body.password, false, false],
//           async (err, result) => {
//             if (err) {
//               return res
//                 .status(REQUEST_CODES.SERVER_ERROR)
//                 .json({ message: "Something Went Wrong" });
//             }

//             const genNewOtpCode = Math.floor(Math.random() * 9000) + 1000;
//             const expirationTime = new Date();
//             expirationTime.setMinutes(expirationTime.getMinutes() /* + 15 */);

//             db.query(
//               "INSERT INTO otps (userId, otpCode, otpType, expiredIn) VALUES (?, ?, ?, ?)",
//               [
//                 result.insertId,
//                 genNewOtpCode,
//                 "EMAIL_VERIFICATION",
//                 expirationTime,
//               ],
//               async (err, _) => {
//                 if (err) {
//                   return res
//                     .status(REQUEST_CODES.SERVER_ERROR)
//                     .json({ message: "Something Went Wrong" });
//                 }
//                 const transporter = nodeMailer.createTransport({
//                   service: "gmail",
//                   auth: { user: process.env.EMAIL, pass: process.env.PASSWORD },
//                 });

//                 const mailOptions = {
//                   from: process.env.EMAIL,
//                   to: req.body.email,
//                   subject: "OTP verification code",
//                   html: emailTemplateSendOTPCode(
//                     genNewOtpCode,
//                     req.body.fullName,
//                     req.body.email
//                   ),
//                 };

//                 await transporter.sendMail(mailOptions);

//                 res.status(REQUEST_CODES.CREATED).json({
//                   message:
//                     "Congratulations your account has been created successfully. Please check your email to verify your account.",
//                 });
//               }
//             );
//           }
//         );
//       }
//     );
//   } catch (_) {
//     return res
//       .status(REQUEST_CODES.SERVER_ERROR)
//       .json({ message: "Something Went Wrong" });
//   }
// };

// /* ==> VERIFY USER ACCOUNT <== */
// const verifyUserAccount = async (req, res) => {
//   try {
//     const validator = joi.object({
//       email: joi.string().trim().min(6).required(),
//       otpCode: joi.string().trim().min(4).max(4).required(),
//     });
//     const { error } = validator.validate(req.body);
//     if (error) {
//       return res
//         .status(REQUEST_CODES.BAD_REQUEST)
//         .json({ message: error.details[0].message });
//     }

//     const { email, otpCode } = req.body;

//     db.query(
//       "SELECT * FROM users WHERE email = ?",
//       [email],
//       async (error, result) => {
//         if (error) {
//           return res
//             .status(REQUEST_CODES.SERVER_ERROR)
//             .json({ message: "Something Went Wrong" });
//         }

//         if (result.length <= 0) {
//           return res
//             .status(REQUEST_CODES.BAD_REQUEST)
//             .json({ error: "User Not Found !" });
//         }

//         const currentUser = result[0];

//         if (currentUser.isVerified) {
//           return res
//             .status(REQUEST_CODES.OK)
//             .json({ message: "Your Account Is Already Verified !" });
//         }

//         db.query(
//           "SELECT * FROM otps WHERE userId = ?",
//           [currentUser.id],
//           async (error, result) => {
//             if (error) {
//               return res
//                 .status(REQUEST_CODES.SERVER_ERROR)
//                 .json({ message: "Something Went Wrong" });
//             }

//             if (result.length <= 0) {
//               return res
//                 .status(REQUEST_CODES.BAD_REQUEST)
//                 .json({ error: "User Not Found !" });
//             }

//             const currentOtp = result[0];

//             if (currentOtp.otpType !== "EMAIL_VERIFICATION") {
//               return res
//                 .status(REQUEST_CODES.BAD_REQUEST)
//                 .json({ error: "Something Went Wrong" });
//             }

//             if (currentOtp.otpCode !== otpCode) {
//               return res
//                 .status(REQUEST_CODES.BAD_REQUEST)
//                 .json({ error: "invalid OTP code" });
//             }
            
//             const expiredIn = new Date(currentOtp.expiredIn);
//             const currentTime = new Date();
//             if (currentTime > expiredIn) {
//               return res
//                 .status(REQUEST_CODES.BAD_REQUEST)
//                 .json({ error: "Invalid OTP code (expired)" });
//             }

//             db.query(
//               `UPDATE users SET isVerified = true WHERE email = ?`,
//               [email],
//               (error, _) => {
//                 if (error) {
//                   return res
//                     .status(REQUEST_CODES.SERVER_ERROR)
//                     .json({ message: "Something Went Wrong" });
//                 }

//                 db.query(
//                   `DELETE FROM otps WHERE userId = ?;`,
//                   [currentUser.userId],
//                   (error, _) => {
//                     if (error) {
//                       return res
//                         .status(REQUEST_CODES.SERVER_ERROR)
//                         .json({ message: "Something Went Wrong" });
//                     }
//                     res.status(REQUEST_CODES.OK).json({
//                       message: "Account Verified Successfully !",
//                     });
//                   }
//                 );
//               }
//             );
//           }
//         );
//       }
//     );
//   } catch (_) {
//     return res
//       .status(REQUEST_CODES.BAD_REQUEST)
//       .json({ message: "Something Went Wrong" });
//   }
// };

// /* ==> RE SEND OTP VERIFY USER ACCOUNT <== */
// const reSendOTPVerifyUserAccount = async (req, res) => {
//   try {
//     const validator = joi.object({
//       email: joi.string().trim().min(6).required(),
//     });
//     const { error } = validator.validate(req.body);
//     if (error) {
//       return res
//         .status(REQUEST_CODES.BAD_REQUEST)
//         .json({ message: error.details[0].message });
//     }

//     const { email } = req.body;
//     db.query(
//       "SELECT * FROM users WHERE email = ?",
//       [email],
//       async (error, result) => {
//         if (error) {
//           return res
//             .status(REQUEST_CODES.SERVER_ERROR)
//             .json({ message: "Something Went Wrong" });
//         }

//         if (result.length <= 0) {
//           return res
//             .status(REQUEST_CODES.BAD_REQUEST)
//             .json({ error: "User Not Found !" });
//         }

//         const currentUser = result[0];

//         if (currentUser.isVerified) {
//           return res
//             .status(REQUEST_CODES.OK)
//             .json({ message: "Your Account Is Already Verified !" });
//         }

//         db.query(
//           "SELECT * FROM otps WHERE userId = ?",
//           [currentUser.id],
//           async (error, result) => {
//             if (error) {
//               return res
//                 .status(REQUEST_CODES.SERVER_ERROR)
//                 .json({ message: "Something Went Wrong" });
//             }

//             if (result.length <= 0) {
//               return res
//                 .status(REQUEST_CODES.BAD_REQUEST)
//                 .json({ error: "User Not Found !" });
//             }

//             const currentOtp = result[0];

//             if (currentOtp.otpType !== "EMAIL_VERIFICATION") {
//               return res
//                 .status(REQUEST_CODES.BAD_REQUEST)
//                 .json({ error: "Something Went Wrong" });
//             }

//             const expiredIn = new Date(currentOtp.expiredIn);
//             const currentTime = new Date();
//             if (currentTime < expiredIn) {
//               return res
//                 .status(REQUEST_CODES.BAD_REQUEST)
//                 .json({ error: "Already sent OTP code, Please check your email" });
//             }

//             const genNewOtpCode = Math.floor(Math.random() * 9000) + 1000;
//             const expirationTime = new Date();
//             expirationTime.setMinutes(expirationTime.getMinutes() + 30);

//             db.query(
//               "UPDATE otps SET otpCode = ?, expired_in = ? WHERE userId = ?",
//               [
//                 genNewOtpCode,
//                 expirationTime,
//                 currentUser.id
//               ],
//               async (err, _) => {
//                 if (err) {
//                   return res
//                     .status(REQUEST_CODES.SERVER_ERROR)
//                     .json({ message: "Something Went Wrong" });
//                 }
//                 const transporter = nodeMailer.createTransport({
//                   service: "gmail",
//                   auth: { user: process.env.EMAIL, pass: process.env.PASSWORD },
//                 });

//                 const mailOptions = {
//                   from: process.env.EMAIL,
//                   to: req.body.email,
//                   subject: "OTP verification code",
//                   html: emailTemplateSendOTPCode(
//                     genNewOtpCode,
//                     currentUser.fullName,
//                     currentUser.email
//                   ),
//                 };

//                 await transporter.sendMail(mailOptions);

//                 res.status(REQUEST_CODES.CREATED).json({
//                   message:
//                     "Please check your email to verify your account.",
//                 });
//               }
//             );
//           }
//         );
//       }
//     );

//   } catch (_) {
//     return res
//       .status(REQUEST_CODES.BAD_REQUEST)
//       .json({ message: "Something Went Wrong" });
//   }
// };

// module.exports = {
//   register,
//   verifyUserAccount,
//   reSendOTPVerifyUserAccount,
// };
