const mongoose = require("mongoose");

const brandSchema = new mongoose.Schema({
    name:{
        type:String,
        trim:true,
        unique:true,
        required:[true,"please enter your name"],
        minLength:[3,"too short"],
        maxLength:[32,"too long"]
    },
    slug:{
        type:String,
        lowercase:true
    },
    image:{
        type:String
    }
},{
    timestamp:true
});

module.exports = mongoose.model("Brand",brandSchema);