const ApiFeature = require("../utils/apiFeature");


exports.deleteOne = (Model)=>async(request,response,next)=>{
        try{
            const document = await Model.findByIdAndDelete(request.params.id);
            if(!document){
                throw new Error("invalid id");
            }
            response.status(200).json({
                message:"deleted"
            })
        }catch(err){
            next(err)
        }
    };

exports.findOne = (Model)=>async(request,response,next)=>{
    try{
        const document = await Model.findById(request.params.id);
        if(!document){
            throw new Error("invalid id");
        }
        response.status(200).json({
            data:{
                document
            }
        })
    }catch(err){
        next(err);
    }
};

exports.updateOne = (Model) => async(request,response,next)=>{
    try{
        const document = await Model.findByIdAndUpdate(request.param.id,request.body,{new:true});
        if(!document){
            throw new Error("invalid id")
        }
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