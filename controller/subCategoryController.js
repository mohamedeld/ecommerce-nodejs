

const subCategory = require("../Model/subCategoryModel");

const factory = require("./handlerFactory");

exports.setCategoryToBody = (request,response,next)=>{
    if(!request.body.category) request.body.category = request.params.categoryId;
    next();
}
exports.createSubCategory = factory.createOne(subCategory);


exports.createFilterObject = (request,response,next)=>{

    let filterObject ={};
    if(request.params.categoryId) filterObject = {category:request.params.categoryId};
    request.filterObj = filterObject;
    next();
}
exports.allSubCategories = factory.findAll(subCategory);

exports.getSubCategory= factory.findOne(subCategory);

exports.updateSubCategory = factory.updateOne(subCategory);

exports.deleteSubCategory = factory.deleteOne(subCategory);


