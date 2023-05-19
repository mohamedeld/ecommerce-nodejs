const multer = require("multer");
const { v4: uuidv4 } = require("uuid");
const sharp = require("sharp");
const { uploadSingleImage } = require("../middleware/uploadImageMW");
// const storage = multer.diskStorage({
//     destination:function(req,file,cb){
//         cb(null,"uploads/categories")
//     },
//     filename:function(req,file,cb){
//         const ext = file.mimetype.split('/')[1];
//         const filename = `category-${uuidv4()}-${Date.now()}.${ext}`;
//         cb(null,filename);
//     }
// })
// const storage = multer.memoryStorage();

// const multerFilter = function (req, file, cb) {
//   if (file.mimetype.startsWith("image")) {
//     cb(null, true);
//   } else {
//     cb(new Error("this file is not image"), false);
//   }
// };
// const upload = multer({ storage, fileFilter: multerFilter });

exports.uploadCategoryImage = uploadSingleImage("image");

exports.resizeImage = async (request, response, next) => {
  try {
    const filename = `category-${uuidv4()}-${Date.now()}.jpeg`;
    await sharp(request.file.buffer)
      .resize(600, 600)
      .toFormat("jpeg")
      .jpeg({
        quality: 90,
      })
      .toFile(`uploads/categories/${filename}`);
    request.body.image = filename;
    next();
  } catch (err) {
    next(err);
  }
};
const Category = require("../Model/categoryModel");

const factory = require("./handlerFactory");

exports.createCategory = factory.createOne(Category);
exports.getCategories = factory.findAll(Category);

exports.getCategory = factory.findOne(Category);

exports.updateCategory = factory.updateOne(Category);

exports.deleteCategory = factory.deleteOne(Category);
