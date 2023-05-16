const asyncHandler = require("express-async-handler");
const slugify = require("slugify");
const Category = require("../Model/categoryModel");
const ApiError = require("../utils/ApiError");


exports.createCategory =asyncHandler(async(request,response,next)=>{

        const {name} = request.body;
        const category = await Category.create({name,slug:slugify(name)});
        response.status(200).json({
            message:"success",
            data:{
                category
            }
        })
});
exports.getCategories =asyncHandler(async(request,response,next)=>{
        const page=request.query.page * 1 || 1;
        const limit = request.query.limit * 1 || 5;
        const skip = (page - 1)*limit;
        const categories = await Category.find({}).skip(skip).limit(limit);
        response.status(200).json({
            results:categories.length,
            page,
            data:{
                categories
            }
        })
});

exports.getCategory =asyncHandler(async(request,response,next)=>{
    const category = await Category.findById(request.params.id);
        if(!category){
            // response.status(404).json({message:"no category by this id"});
            return next(new ApiError("no category by this id",404));
        }
        response.status(200).json({
            data:{
                category
            }
        })
});

exports.updateCategory = asyncHandler(async(request,response,next)=>{
    const {name} = request.body;
    const category = await Category.findByIdAndUpdate(request.params.id,{name,slug:slugify(name)},{new:true})
    if(!category){
        // response.status(404).json({message:"no category by this id"});
        return next(new ApiError("no category by this id",404));
    }
    response.status(200).json({
        data:{
            category
        }
    })
});

exports.deleteCategory = asyncHandler(async(request,response,next)=>{
    const category = await Category.findByIdAndDelete(request.params.id);
    if(!category){
        return next(new ApiError("no category by this id",404));
    }
    response.status(200).json({
        message:"deleted"
    })
})