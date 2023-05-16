const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
    title:{
        type:String,
        trim:true,
        unique:true,
        minLength:[3,"too short"],
        maxLength:[100,"too long"]
    },
    slug:{
        type:String,
        lowerCase:true
    },
    description:{
        type:String,
        required:[true,"product description is required"],
        minLength:[20,"too short description"]
    },
    quantity:{
        type:Number,
        required:true
    },
    sold:{
        type:Number,
        default:0
    },
    price:{
        type:Number,
        required:[true,"product price is requied"],
        trim:true
    },
    priceAfterDiscount:{
        type:Number
    },
    colors:[String],
    imageCover:{
        type:String,
        required:[true,"product should have a image cover"]
    },
    images:[String],
    category:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Category",
        required:[true,"product category is required"]
    },
    subcategory:[
        {
            type:mongoose.Schema.Types.ObjectId,
            ref:"subCategory"
        }
    ],
    brand:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Brand"
    },
    ratingsAverage:{
        type:Number,
        min:[1,"must be above or equal 1"],
        max:[5,"must be below or equal 5"]
    },
    ratingQuantity:{
        type:Number,
        default:0
    }
},{timestamps:true});

module.exports = mongoose.model("Product",productSchema);