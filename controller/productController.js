const multer = require("multer");
const sharp = require("sharp");
const { v4: uuidv4 } = require("uuid");
const Product = require("../Model/productModel");
const { uploadMultipleImage } = require("../middleware/uploadImageMW");
const factory = require("./handlerFactory");

exports.uploadProductImages = uploadMultipleImage([
  { name: "imageCover", maxCount: 1 },
  { name: "images", maxCount: 5 },
]);
exports.resizeProductImage = async (request, response, next) => {
  try {
    if (request.files.imageCover) {
      const imageCoverFilename = `products-${uuidv4()}-${Date.now()}-cover.jpeg`;
      await sharp(request.files.imageCover[0].buffer)
        .resize(2000, 1333)
        .toFormat("jpeg")
        .jpeg({ quality: 90 })
        .toFile(`uploads/products/${imageCoverFilename}`);
      request.body.imageCover = imageCoverFilename;
    }
    if (request.files.images) {
      request.body.images = [];
      await Promise.all(
        request.files.images.map(async (img, index) => {
          const imageName = `products-${uuidv4()}-${Date.now()}-${
            index + 1
          }.jpeg`;
          await sharp(img.buffer)
            .resize(600, 600)
            .toFormat("jpeg")
            .jpeg({ quality: 95 })
            .toFile(`uploads/products/${imageName}`);
          request.body.images.push(imageName);
        })
      );
    }
    next();
  } catch (err) {
    next(err);
  }
};

exports.createProduct = factory.createOne(Product);

exports.getAllProducts = factory.findAll(Product);

exports.getProduct = factory.findOne(Product);

exports.updateProduct = factory.updateOne(Product);

exports.deleteProduct = factory.deleteOne(Product);
