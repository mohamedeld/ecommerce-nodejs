const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const bcrypt = require("bcrypt");
const User = require("../Model/userModel");
const sendEmail = require("../utils/sendEmail");
const AppError = require("../utils/appError");
const catchAsync = require("../utils/catchAsync");
const {sanitizeUser} = require("../utils/sanitizeData");

exports.signUp = async (request, response, next) => {
  try {
    const user = await User.create({
      name: request.body.name,
      email: request.body.email,
      password: request.body.password,
    });
    const token = jwt.sign(
      { userId: user._id },
      process.env.JWT_SECRET_KEY,
      {
        expiresIn: process.env.EXPIRES_TIME,
      }
    );
    

    response.status(201).json({
      status:"success",
      data: {
        user,
        token
      },
    });
  } catch (err) {
    next(err);
  }
};

exports.loginUser = catchAsync(async (request, response, next) => {
  const user = await User.findOne({ email: request.body.email });
  console.log(user.email);
  if (!user) {
    return next(new AppError("invalid email please sign up", 401));
  }

  const validPassword = await bcrypt.compare(
    request.body.password,
    user.password
  );
  if (!validPassword) {
    throw new Error("invalid password ");
  }
  const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET_KEY, {
    expiresIn: process.env.EXPIRES_TIME,
  });

  response.status(200).json({
    message: "logged in successfully",
    data: {
      user,
      token,
    },
  });
});


exports.protect = catchAsync(async (request,response,next)=>{
  
  
    let token;
    if(request.headers.authorization && request.headers.authorization.startsWith('Bearer')){
      token = request.headers.authorization.split(' ')[1];
    }
    if (!token) {
      throw new Error("access denied")
    }
    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
    
    const currentUser = await User.findById(decoded.userId);
    if(!currentUser){
      throw new Error(
        "the user that belong to this token does no longer exist"
      );
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
  
});

exports.allowedTo = (...roles) =>{
  return (request, response, next) => {
      if (!roles.includes(request.user.role)) {
        return next(new Error("you don't have permission for this role", 403));
      }
      next();
    } 
  };


exports.forgetPassword = catchAsync(async(request,response,next)=>{
  
    const user = await User.findOne({email:request.body.email});
    if(!user){
      throw new Error("this email is not exist");
    }
    const resetCode = Math.floor(100000 + Math.random()* 900000).toString();
    const hashedResetCode = crypto
      .createHash("sha256")
      .update(resetCode)
      .digest("hex");
      user.passwordResetCode = hashedResetCode;
      user.passwordResetExpires = Date.now() + 10 * 60 * 1000;
      user.passwordResetVerified =false;
      await user.save({ validateBeforeSave: false });
      try{
        await sendEmail({
        email: user.email,
        subject: "your password reset code (valid for 10 minutes)",
        text: `HI, ${user.name} your reset code ${resetCode}`
      });
      response.status(200).json({
        status: "success",
        message: "reset code is sent to email",
      });
      }catch(err){
        user.passwordResetCode = undefined;
        user.passwordResetExpires = undefined;
        user.passwordResetVerified = undefined;

        await user.save({ validateBeforeSave: false });
        return next(new AppError("an error through sending an email try again",500))
      }
      
});

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
    user.password = request.body.password;
    user.confirmPassword= request.body.confirmPassword;
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