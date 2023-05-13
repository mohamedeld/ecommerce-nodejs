const express = require("express");
const dotenv = require("dotenv");
const morgan = require("morgan");
const mongoose = require("mongoose");
const bodyParser =require("body-parser");
const app = express();
dotenv.config({path:"./config.env"});


if(process.env.NODE_ENV === 'development'){
    app.use(morgan("dev"));
}
app.use(bodyParser.urlencoded({extended:false}));

const DB = process.env.DATABASE.replace("<password>",process.env.PASSWORD);
mongoose.connect(DB).then(()=> console.log("connected to database"));

app.use((request,response,next)=>{
    response.status(404).json({
        message:"Page Not Found"
    })
});

app.use((error,request,response,next)=>{
    response.status(500).json({
        message:error+""
    })
});

const PORT = process.env.PORT || 8000;
app.listen(PORT,()=>{
    console.log("listening")
})
