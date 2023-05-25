const jwt = require("jsonwebtoken");
const User = require("../Model/userModel");
module.exports = async (request, response, next) => {
  const token = request.header("x-auth-token");
  if (!token) {
    response.status(401).json({ message: "access denied" });
  }
  try {
    const decodedPassword = jwt.verify(token, process.env.SECRET_KEY);
    if (decodedPassword.adminRole !== "admin") {
      response.status(401).json({
        message: "access denied",
      });
    }
    const currentUser = User.findById(decodedPassword.userId);
    if (!currentUser) {
      response.status(401).json({
        message: "unauthorized user",
      });
    }
    //getTime change date to timestamp
    if(currentUser.passwordChangeAt){
      const passwordChangedTimestamp = parseInt(currentUser.passwordChangeAt.getTime()/1000,10);
      if(passwordChangedTimestamp > decodedPassword.iat){
        return next(new Error("user recently change his password please login again"));
      }
    }
    next();
  } catch (err) {
    next(err);
  }
};
