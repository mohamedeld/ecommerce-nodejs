const mongoose = require("mongoose");

const subCategorySchema = new mongoose.Schema({
    name:{
        type:String,
        trim:true,
        unique:[true,"must be unique"],
        minLength:[3,"too short"],
        maxLength:[32,"too long"]
    },
    slug:{
        type:String,
        lowercase:true
    },
    category:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Category",
        required:[true,"subcategory must be belonged to category"]
    }
},{timestamp:true});

const subCategoryModel = mongoose.model("subCategory",subCategorySchema);
module.exports = subCategoryModel;