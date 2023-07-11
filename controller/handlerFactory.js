const ApiFeature = require("../utils/apiFeature");
const AppError = require("../utils/appError");
const catchAsync = require("../utils/catchAsync");

exports.deleteOne = (Model)=>async(request,response,next)=>{
        try{
            const document = await Model.findByIdAndDelete(request.params.id);
            if(!document){
                throw new Error("invalid id");
            }
            document.remove();
            response.status(200).json({
                message:"deleted"
            })
        }catch(err){
            next(err)
        }
    };

exports.findOne = (Model,populationOptions)=>catchAsync(async(request,response,next)=>{
    
        // build query
        let query = Model.findById(request.params.id);
        if(populationOptions){
            query = query.populate(populationOptions);
        }
        //execute query
        const document = await query; 
        if(!document){
            return next(new AppError("invalid id ",404))
        }
        response.status(200).json({
            data:{
                document
            }
        })
    });

exports.updateOne = (Model) => async(request,response,next)=>{
    try{
        const document = await Model.findByIdAndUpdate(request.params.id,request.body,{new:true});
        if(!document){
            throw new Error("invalid id")
        }
        document.save();
        response.status(200).json({
            data:{
                document
            }
        })
    }catch(err){
        next(err);
    }
};

exports.createOne = (Model)=> async(request,response,next)=>{
    try{
        const document = await Model.create(request.body);
        response.status(200).json({
            data:{
                document
            }
        })
    }catch(err){
        next(err);
    }
};

exports.findAll = (Model) => async(request,response,next)=>{
    try{
        let filter = {};
        if(request.filterObj) {
            filter = request.filterObj;
        }
        const documentCounts = await Model.countDocuments();
        const apiFeature = new ApiFeature(Model.find(filter),request.query).paginate(documentCounts).filter().search("Brand").limitFields().sort();
        const {mongooseQuery,paginationResult} = apiFeature;

        const document = await apiFeature.mongooseQuery;
        response.status(200).json({
            result:document.length,
            paginationResult,
            data:{
                document
            }
        })
    }catch(err){
        next(err);
    }
};