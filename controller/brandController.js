const slugify = require("slugify");
const Brand = require("../Model/brandModel");


exports.createBrand = async(request,response,next)=>{
    try{
        const {name,image} = request.body;
        const brands =await Brand.create({name,slug:slugify(name),image});
        response.status(200).json({
            data:{
                brands
            }
        })
    }catch(err){
        next(err);
    }
    
};

exports.getAllBrands = async(request,response,next)=>{
    try{
        const page = request.query.page *1;
        const limit = request.query.limit *1;
        const skip = (page -1)*limit;
        const brands = await Brand.find({}).skip(skip).limit(limit);
        response.status(200).json({
            data:{
                brands
            }
        })
    }catch(err){
        next(err);
    }
};

exports.getBrand = async(request,response,next)=>{
    try{
        const brand = await Brand.findById(request.params.id);
        if(!brand){
            throw new Error("brand id is invalid")
        }
        response.status(200).json({
            data:{
                brand
            }
        })
    }catch(err){
        next(err);
    }
};

exports.updateBrand = async(request,response,next)=>{
    try{
        const brand = await Brand.findByIdAndUpdate(request.params.id,request.body,{new:true});
        if(!brand){
            throw new Error("brand id is invalid")
        }
        response.status(200).json({
            data:{
                brand
            }
        })
    }catch(err){
        next(err);
    }
};

exports.deleteBrand = async(request,response,next)=>{
    try{
        const brand = await Brand.findByIdAndDelete(request.params.id);
        if(!brand){
            throw new Error("brand id is invalid")
        }
        response.status(200).json({
            message:"deleted"
        })
    }catch(err){
        next(err);
    }
};