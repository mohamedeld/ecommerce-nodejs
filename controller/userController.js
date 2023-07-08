const { v4: uuidv4 } = require("uuid");
const sharp = require("sharp");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { uploadSingleImage } = require("../middleware/uploadImageMW");
const User = require("../Model/userModel");

const {
  createOne,
  findAll,
  findOne,
  updateOne,
  deleteOne,
} = require("./handlerFactory");

exports.uploadUserImage = uploadSingleImage("imgProfile");

exports.resizeUserImage = async (request, response, next) => {
  try {
    const filename = `users-${uuidv4()}-${Date.now()}.jpeg`;
    await sharp(request.file.buffer)
      .resize(600, 600)
      .toFormat("jpeg")
      .jpeg({ quality: 90 })
      .toFile(`uploads/users/${filename}`);
    request.body.image = filename;
    next();
  } catch (err) {
    next(err);
  }
};

exports.addUser = createOne(User);
exports.getUsers = findAll(User);

exports.getUser = findOne(User);

exports.updateUser = async (request, response, next) => {
  try {
    const user = await User.findByIdAndUpdate(
      request.params.id,
      {
        name: request.body.name,
        slug: request.body.slug,
        email: request.body.email,
        role: request.body.role,
        active: request.body.active,
        phone: request.body.phone,
        imgProfile: request.body.imgProfile,
      },
      { new: true }
    );
    response.status(200).json({
      data: {
        user,
      },
    });
  } catch (err) {
    next(err);
  }
};

exports.changeUserPassword = async (request, response, next) => {
  try {
    const user = await User.findByIdAndUpdate(
      request.params.id,
      {
        password: await bcrypt.hash(request.body.password, 10),
        passwordChangeAt: Date.now(),
      },
      { new: true }
    );
    response.status(200).json({
      data: {
        user,
      },
    });
  } catch (err) {
    next(err);
  }
};

exports.deleteUser = deleteOne(User);

exports.getLoggedUserData = async (request, response, next)=>{
  try{  
    request.params.id = request.user._id;
    next();
  }catch(err){
    next(err);
  }
};

exports.updateLoggedUserPassword = async(request,response,next)=>{
  try{
    const user = await User.findByIdAndUpdate(request.user._id, {
      password: await bcrypt.hash(request.body.password),
      passwordChangeAt: Date.now(),
    },{new:true});
    const token = jwt.sign(
      { userId: user._id, userRole: user.role },
      process.env.JWT_SECRET_KEY,
      {
        expiresIn: process.env.EXPIRES_TIME,
      }
    );
    response.status(200).json({
      data: {
        user,
      },
      token,
    });
  }catch(err){
    next(err);
  }
}

exports.updateLoggedUserDataWithoutPassword = async(request,response,next)=>{
  try{
    const user= await User.findByIdAndUpdate(request.user._id,{
      name:request.body.name,
      phone:request.body.phone,
      email:request.body.email
    },{new:true});
    response.status(200).json({
      data:{
        user
      }
    })
  }catch(err){
    next(err);
  }
};

exports.deActivateUser = async (request,response,next)=>{
  try{
    await User.findByIdAndUpdate(request.user._id,{
      active:false
    },{new:true})
    response.status(204).json({
      status:"success"
    })
  }catch(err){
    next(err);
  }
}