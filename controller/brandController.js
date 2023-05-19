
const Brand = require("../Model/brandModel");


const factory = require("./handlerFactory");



exports.createBrand = factory.createOne(Brand);
exports.getAllBrands = factory.findAll(Brand)

exports.getBrand = factory.findOne(Brand);

exports.updateBrand = factory.updateOne(Brand);

exports.deleteBrand = factory.deleteOne(Brand);
