const { v4: uuidv4 } = require("uuid");
const sharp = require("sharp");
const { uploadSingleImage } = require("../middleware/uploadImageMW");
const User = require("../Model/userModel");
const bcrypt = require("bcrypt");
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
