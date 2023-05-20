const { v4: uuidv4 } = require("uuid");
const sharp = require("sharp");
const { uploadSingleImage } = require("../middleware/uploadImageMW");
const User = require("../Model/userModel");

const factory = require("./handlerFactory");

exports.uploadBrandImage = uploadSingleImage("imgProfile");

exports.resizeImage = async (request, response, next) => {
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

exports.createBrand = factory.createOne(User);
exports.getAllBrands = factory.findAll(User);

exports.getBrand = factory.findOne(User);

exports.updateBrand = factory.updateOne(User);

exports.deleteBrand = factory.deleteOne(User);
