
const slugify = require("slugify");
const Category = require("../Model/categoryModel");



exports.createCategory =async(request,response,next)=>{
    try{
        const {name} = request.body;
        const category = await Category.create({name,slug:slugify(name)});
        response.status(200).json({
            message:"success",
            data:{
                category
            }
        })
    }catch(err){
        next(err);
    }
};
exports.getCategories = async(request,response,next)=>{
    try{
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
    }catch(err){
        next(err);
    }
};

exports.getCategory =async(request,response,next)=>{
    try{
        const category = await Category.findById(request.params.id);
        if(!category){
            // response.status(404).json({message:"no category by this id"});
            throw new Error("category id is invalid")
        }
        response.status(200).json({
            data:{
                category
            }
        })
    }catch(err){
        next(err);
    }
};

exports.updateCategory = async(request,response,next)=>{
    try{
        const {name} = request.body;
        const category = await Category.findByIdAndUpdate(request.params.id,{name,slug:slugify(name)},{new:true})
        if(!category){
            // response.status(404).json({message:"no category by this id"});
            throw new Error("category id is invalid")
        }
        response.status(200).json({
            data:{
                category
            }
        })
    }catch(err){
        next(err);
    }
    
};

exports.deleteCategory = async(request,response,next)=>{
    try{
        const category = await Category.findByIdAndDelete(request.params.id);
        if(!category){
            throw new Error("category id is invalid")
        }
        response.status(200).json({
            message:"deleted"
        })
    }catch(err){
        next(err);
    }
};