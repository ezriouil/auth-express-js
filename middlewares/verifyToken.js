const jwt = require('jsonwebtoken');
const REQUEST_CODES = require('../utils/request_codes');


/*________________ VERIFY TOKEN ________________*/
function verifyToken(req, res, next) {

  const token = req.headers.token;

  if(!token){
    return res.status(REQUEST_CODES.BAD_REQUEST).json({message : "No Token Provided"});
  }

  try {
    
    const decoded = jwt.decode(token, process.env.JWT_SECRET_KEY);
    req.user = decoded;
    next();

  } catch (error) {
    return res.status(REQUEST_CODES.BAD_REQUEST).json({message : "Invalid Token"});
  }
}


/*________________ VERIFY TOKEN AND USER_ID AND IS_ADMIN ________________*/
function verifyTokenAndAuthorization(req, res, next) {
  verifyToken(req, res, () => {

    try {

      if( req.user.id == req.params.id || req.user.isAdmin === true){

        next();

      }
      else{
        return res.status(REQUEST_CODES.FORBIDDEN).json({message : "You Are Not Allowed"});
      }
    

    } catch (error) {
      return res.status(REQUEST_CODES.SERVER_ERROR).json({message : "Something Went Wrong"});
    }

  });
}


/*________________ VERIFY TOKEN AND IS_ADMIN ________________*/
function verifyIsAdmin(req, res, next) {
  verifyToken(req, res, () => {

    try {

      if( req.user.isAdmin ){
        next();
      }
      else{
        return res.status(REQUEST_CODES.FORBIDDEN).json({message : "You Are Not Allowed, Only Admin Allowed"});
      }
      

    } catch (error) {
      return res.status(REQUEST_CODES.SERVER_ERROR).json({message : "Something Went Wrong"});
    }

    

  });
}

module.exports = {
  verifyToken,
  verifyTokenAndAuthorization,
  verifyIsAdmin,
}