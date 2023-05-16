
const slugify = require("slugify");
const subCategory = require("../Model/subCategoryModel");


exports.setCategoryToBody = (request,response,next)=>{
    if(!request.body.category) request.body.category = request.params.categoryId;
    next();
}
exports.createSubCategory = async(request,response,next)=>{
    try{
        const {name,category} =request.body;
        const addSubCategories = await subCategory.create({name,slug:slugify(name),category});
        response.status(200).json({
            data:{
                addSubCategories
            }
        })
    }catch(err){
        next(err);
    }
};

exports.createFilterObject = (request,response,next)=>{

    let filterObject ={};
    if(request.params.categoryId) filterObject = {category:request.params.categoryId};
    request.filterObj = filterObject;
    next();
}
exports.allSubCategories = async(request,response,next)=>{
    try{
        const page = request.query.page * 1;
        const limit = request.query.limit * 1;
        const skip = (page - 1) * limit;
        
        const allSubCategories = await subCategory.find(request.filterObj).skip(skip).limit(limit);
        response.status(200).json({
            data:{
                allSubCategories
            }
        })
    }catch(err){
        next(err)
    }
};

exports.getSubCategory = async(request,response,next)=>{
    try{
        const getOneSubCategory = await subCategory.findById(request.params.id).populate({
            path:"category",
            select:"name -_id"
        });
        if(!getOneSubCategory){
            throw new Error("sub category id is invalid")
        }
        response.status(200).json({
            data:{
                getOneSubCategory
            }
        })
    }catch(err){
        next(err)
    }
};

exports.updateSubCategory = async(request,response,next)=>{
    try{
        const subCategoryUpdated = await subCategory.findByIdAndUpdate(request.params.id,request.body,{new:true});
        if(!subCategoryUpdated){
            throw new Error("sub category id is invalid")
        }
        response.status(200).json({
            data:{
                subCategoryUpdated
            }
        })
    }catch(err){
        next(err)
    }
};

exports.deleteSubCategory = async(request,response,next)=>{
    try{
        const subCategoryDeleted = await subCategory.findByIdAndDelete(request.params.id);
        if(!subCategoryDeleted){
            throw new Error("sub category id is invalid")
        }
        response.status(200).json({
            message:"deleted"
        })
    }catch(err){
        next(err)
    }
};

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
