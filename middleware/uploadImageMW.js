const multer = require("multer");

exports.uploadSingleImage = (fieldName) => {
  const storage = multer.memoryStorage();
  const multerFilter = function (req, file, cb) {
    if (file.mimetype.startsWith("image")) {
      cb(null, true);
    } else {
      cb(new Error("sorry upload image only"), false);
    }
  };
  const upload = multer({ storage, fileFilter: multerFilter });

  return upload.single(fieldName);
};
