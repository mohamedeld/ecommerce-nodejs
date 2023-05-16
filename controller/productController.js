
const slugify = require("slugify");
const Product =require("../Model/productModel");


exports.createProduct = async(request,response,next)=>{
    try{
        request.body.slug = slugify(request.body.title);
        const product = await Product.create(request.body);
        response.status(200).json({
            data:{
                product
            }
        })
    }catch(err){
        next(err);
    }
};

exports.getAllProducts = async(request,response,next)=>{
    try{
        const page = request.query.page *1 ;
        const limit = request.query.limit*1;
        const skip = (page - 1) * limit;
        const products = await Product.find({}).skip(skip).limit(limit);
        response.status(200).json({
            results:products.length,
            page,
            data:{
                products
            }
        })
    }catch(err){
        next(err);
    }
};

exports.getProduct = async(request,response,next)=>{
    try{
        const product = await Product.findById(request.params.id);
        if(!product){
            throw new Error("product id is invalid")
        }
        response.status(200).json({
            data:{
                product
            }
        })
    }catch(err){
        next(err);
    }
};
exports.updateProduct = async(request,response,next)=>{
    try{
        request.body.slug = slugify(request.body.title);
        const product = await Product.findByIdAndUpdate(request.params.id,request.body,{new:true});
        if(!product){
            throw new Error("product id is invalid")
        }
        response.status(200).json({
            data:{
                product
            }
        })
    }catch(err){
        next(err);
    }
}

exports.deleteProduct = async(request,response,next)=>{
    try{
        const product = await Product.findById(request.params.id);
        if(!product){
            throw new Error("product id is invalid")

        }
        response.status(200).json({
            message:"deleted"
        })
    }catch(err){
        next(err);
    }
}