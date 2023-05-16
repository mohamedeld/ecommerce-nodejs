const asyncHandler = require("express-async-handler");
const slugify = require("slugify");
const subCategory = require("../Model/subCategoryModel");
const ApiError = require("../utils/ApiError");

exports.setCategoryToBody = (request,response,next)=>{
    if(!request.body.category) request.body.category = request.params.categoryId;
    next();
}
exports.createSubCategory = asyncHandler(async(request,response,next)=>{
    const {name,category} =request.body;
    const addSubCategories = await subCategory.create({name,slug:slugify(name),category});
    response.status(200).json({
        data:{
            addSubCategories
        }
    })
});

exports.createFilterObject = (request,response,next)=>{
    let filterObject ={};
    if(request.params.categoryId) filterObject = {category:request.params.categoryId};
    request.filterObj = filterObject;
    next();
}
exports.allSubCategories = asyncHandler(async(request,response,next)=>{
    const page = request.query.page * 1;
    const limit = request.query.limit * 1;
    const skip = (page - 1) * limit;
    
    const allSubCategories = await subCategory.find(request.filterObj).skip(skip).limit(limit);
    response.status(200).json({
        data:{
            allSubCategories
        }
    })
});

exports.getSubCategory = asyncHandler(async(request,response,next)=>{
    const getOneSubCategory = await subCategory.findById(request.params.id).populate({
        path:"category",
        select:"name -_id"
    });
    if(!getOneSubCategory){
        return next(new ApiError("invalid id",404))
    }
    response.status(200).json({
        data:{
            getOneSubCategory
        }
    })
});

exports.updateSubCategory = asyncHandler(async(request,response,next)=>{
    const subCategoryUpdated = await subCategory.findByIdAndUpdate(request.params.id,request.body,{new:true});
    if(!subCategoryUpdated){
        next(new ApiError("invalid id",404))
    }
    response.status(200).json({
        data:{
            subCategoryUpdated
        }
    })
});

exports.deleteSubCategory = asyncHandler(async(request,response,next)=>{
    const subCategoryDeleted = await subCategory.findByIdAndDelete(request.params.id);
    if(!subCategoryDeleted){
        next(new ApiError("invalid id",404));
    }
    response.status(200).json({
        message:"deleted"
    })
});

// exports.getMainCategory = asyncHandler(async(request,response,next)=>{
//     const getByCategory = await subCategory.findById(request.params.id).populate({
//         path:"category",
//         select:"name"
//     });
//     if(!getByCategory){
//         next(new ApiError("invalid id",404));
//     }
//     response.status(200).json({
//         data:{
//             getByCategory
//         }
//     })
// });
