

const Product =require("../Model/productModel");

const factory = require("./handlerFactory");

exports.createProduct = factory.createOne(Product);


exports.getAllProducts= factory.findAll(Product);

exports.getProduct = factory.findOne(Product);

exports.updateProduct = factory.updateOne(Product);


exports.deleteProduct =factory.deleteOne(Product); 