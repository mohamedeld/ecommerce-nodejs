const jwt = require("jsonwebtoken");

const bcrypt = require("bcrypt");
const User = require("../Model/userModel");

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
    if (!user) {
      throw new Error("invalid email please sign up");
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
    response.header("x-auth-token", token);
    response.status(200).json({
      message: "logged in successfully",
      data: {
        user,
        token,
      },
    });
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
    if(decoded.userRole !== "admin"){
      response.status(401).json({message:"access denied is admin role"});
    }
    const currentUser = User.findById(decoded.userId);
    if(!currentUser){
      response.status(401).json({ message: "the user that belong to this token does no longer exist" });
    }
    next();
  }catch(err){
    next(err);
  }
}