const multer = require("multer");
const multerOptions = () => {
  const storage = multer.memoryStorage();
  const multerFilter = function (req, file, cb) {
    if (file.mimetype.startsWith("image")) {
      cb(null, true);
    } else {
      cb(new Error("upload only image"), false);
    }
  };
  const upload = multer({ storage, fileFilter: multerFilter });
  return upload;
};
exports.uploadSingleImage = (fieldName) => multerOptions().single(fieldName);

exports.uploadMultipleImage = (arrayOfFields) =>
  multerOptions().fields(arrayOfFields);
