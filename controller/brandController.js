const asyncHandler = require("express-async-handler");
const slugify = require("slugify");
const Brand = require("../Model/brandModel");
const ApiError = require("../utils/ApiError");

exports.createBrand = asyncHandler(async(request,response,next)=>{
    const {name,image} = request.body;
    const brands =await Brand.create({name,slug:slugify(name),image});
    response.status(200).json({
        data:{
            brands
        }
    })
});

exports.getAllBrands = asyncHandler(async(request,response,next)=>{
    const brands = await Brand.find({});
    response.status(200).json({
        data:{
            brands
        }
    })
});

exports.getBrand = asyncHandler(async(request,response,next)=>{
    const brand = await Brand.findById(request.params.id);
    if(!brand){
        next(new ApiError("invlalid id",404));
    }
    response.status(200).json({
        data:{
            brand
        }
    })
});

exports.updateBrand = asyncHandler(async(request,response,next)=>{
    const brand = await Brand.findByIdAndUpdate(request.params.id,request.body,{new:true});
    if(!brand){
        next(new ApiError("invlalid id",404));
    }
    response.status(200).json({
        data:{
            brand
        }
    })
});

exports.deleteBrand = asyncHandler(async(request,response,next)=>{
    const brand = await Brand.findByIdAndDelete(request.params.id);
    if(!brand){
        next(new ApiError("invlalid id",404));
    }
    response.status(200).json({
        message:"deleted"
    })
});