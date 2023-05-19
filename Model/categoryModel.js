const mongoose = require("mongoose");

const categorySchema = new mongoose.Schema({
    name:{
        type:String,
        required:[true,"name is required"],
        unique:[true,"name must be unique"],
        minLength:[3,"should be greater than 3"],
        maxLength:[32,"so long"]
    },
    slug:{
        type:String,
        lowercase:true
    },
    image:{
        type:String
    }
},{timestamps:true});

const categoryModel = mongoose.model("Category",categorySchema);
module.exports = categoryModel;