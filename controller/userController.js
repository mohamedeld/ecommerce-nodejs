const { v4: uuidv4 } = require("uuid");
const sharp = require("sharp");
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

exports.updateUser = updateOne(User);

exports.deleteUser = deleteOne(User);
