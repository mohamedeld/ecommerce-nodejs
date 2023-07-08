const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const bcrypt = require("bcrypt");
const User = require("../Model/userModel");
const sendEmail = require("../utils/sendEmail");

exports.signUp = async (request, response, next) => {
  try {
    const user = await User.create({
      name: request.body.name,
      email: request.body.email,
      password: request.body.password,
    });
    const token = jwt.sign(
      { userId: user._id, userRole: user.role },
      process.env.JWT_SECRET_KEY,
      {
        expiresIn: process.env.EXPIRES_TIME,
      }
    );
    response.header("x-auth-token", token);

    response.status(201).json({
      data: {
        user,
        token
      },
    });
  } catch (err) {
    next(err);
  }
};

exports.login = async (request, response, next) => {
  try {
    const user = await User.findOne({ email: request.body.email });
    console.log(request.body.email);
    console.log(user);
    if (!user) {
      return response.status(401).json({message:"email was not found"})
    }
    
    const validPassword = await bcrypt.compare(
      request.body.password,
      user.password
    );
    if (!validPassword) {
      throw new Error("invalid password ");
    }
    const token =jwt.sign(
      { userId: user._id, userRole: user.role },
      process.env.JWT_SECRET_KEY,
      {
        expiresIn: process.env.EXPIRES_TIME,
      }
    );
    if(!response.headersSent){
      response.header("x-auth-token", token);
      response.status(200).json({
        message: "logged in successfully",
        data: {
          user,
          token,
        },
      });
    }
    
    return;
  } catch (err) {
    next(err);
  }
};


exports.protect = async (request,response,next)=>{
  
  try{
    const token = request.header("x-auth-token");
    if (!token) {
      return response.status(401).json({ message: "access denied" });
    }
    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
    if (decoded.userRole !== "admin" && decoded.userRole !== "manager") {
      response.status(403).json({ message: "access denied" });
    }
    const currentUser = await User.findById(decoded.userId);
    if(!currentUser){
      response.status(401).json({ message: "the user that belong to this token does no longer exist" });
    }
    if (currentUser.passwordChangeAt) {
      const convertDateToTimeStamp = parseInt(currentUser.passwordChangeAt.getTime() / 1000,10);
      if(convertDateToTimeStamp> decoded.iat){
        response
          .status(401)
          .json({
            message: "the user change his password please login again",
          });
      }
    }
    request.user = currentUser;
    next();
  }catch(err){
    next(err);
  }
};
/*
exports.allowedTo =
  (...roles) =>
  async (request, response, next) => {
    try {
      if(!roles.included(request.user.role)){
        response.status(403).json({
          message:"access denied"
        })
      }
      next();
    } catch (err) {
      next(err);
    }
  };
  **/

exports.forgetPassword = async(request,response,next)=>{
  try{
    const user = await User.findOne({email:request.body.email});
    if(!user){
      response.status(404).json({message:"this email is not exist"})
    }
    const resetCode = Math.floor(100000 + Math.random()* 900000).toString();
    const hashedResetCode = crypto
      .createHash("sha256")
      .update(resetCode)
      .digest("hex");
      user.passwordResetCode = hashedResetCode;
      user.passwordResetExpires = Date.now() + 10 * 60 * 1000;
      user.passwordResetVerified =false;
      await user.save();
      try{
        await sendEmail({
        email: user.email,
        subject: "your password reset code (valid for 10 minutes)",
        message: `HI, ${user.name} your reset code ${resetCode}`,
      });
      }catch(err){
        user.passwordResetCode = undefined;
        user.passwordResetExpires = undefined;
        user.passwordResetVerified = undefined;

        await user.save();
        response.status(500).json({
          message:`there is an error in sending email ${err}`
        })
      }
      
      response.status(200).json({
        status:"success",
        message:"reset code is sent to email"
      })
      next()
  }catch(err){
    next(err)
  }
};

exports.verifyPasswordResetCode = async(request,response,next)=>{
  try{
    const hashResetCode = crypto.createHash("sha256").update(request.body.resetCode).digest("hex");
    const user = await User.findOne({
      passwordResetCode: hashResetCode,
      passwordResetExpires:{$gt:Date.now()},
    });
    if(!user){
      throw new Error("reset code is invalid or expired")
    }
    // reset code valid
    user.passwordResetVerified= true;
    await user.save();
    response.status(200).json({
      status:"success"
    })
  }catch(err){
    next(err);
  }
};

exports.resetPassword = async(request,response,next)=>{
  try{
    const user = await User.findOne({email:request.body.email});
    if(!user){
      throw new Error("email is not found please sign up");
    }
    if (!user.passwordResetVerified) {
      throw new Error("reset code not verified");
    }
    user.password = request.body.newPassword;
    user.passwordResetCode = undefined;
    user.passwordResetExpires = undefined;
    user.passwordResetVerified = undefined;
    await user.save();
    const token = jwt.sign(
      { userId: user._id, userRole: user.role },
      process.env.JWT_SECRET_KEY,
      {
        expiresIn: process.env.EXPIRES_TIME,
      }
    );
    response.status(200).json({
      token
    })
  }catch(err){
    next(err);
  }
}