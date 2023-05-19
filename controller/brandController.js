const { v4: uuidv4 } = require("uuid");
const sharp = require("sharp");
const { uploadSingleImage } = require("../middleware/uploadImageMW");
const Brand = require("../Model/brandModel");

const factory = require("./handlerFactory");

exports.uploadBrandImage = uploadSingleImage("image");

exports.resizeImage = async (request, response, next) => {
  try {
    const filename = `brand-${uuidv4()}-${Date.now()}.jpeg`;
    await sharp(request.file.buffer)
      .resize(600, 600)
      .toFormat("jpeg")
      .jpeg({ quality: 90 })
      .toFile(`uploads/brands/${filename}`);
    request.body.image = filename;
    next();
  } catch (err) {
    next(err);
  }
};

exports.createBrand = factory.createOne(Brand);
exports.getAllBrands = factory.findAll(Brand);

exports.getBrand = factory.findOne(Brand);

exports.updateBrand = factory.updateOne(Brand);

exports.deleteBrand = factory.deleteOne(Brand);
