const express = require("express");
const dotenv = require("dotenv");
const morgan = require("morgan");
const databaseConnection = require("./config/database");
const categoryRouter = require("./routes/categoryRoutes");
const bodyParser =require("body-parser");
const app = express();
app.use(express.json());
dotenv.config({path:"./config.env"});


if(process.env.NODE_ENV === 'development'){
    app.use(morgan("dev"));
}
const PORT = process.env.PORT || 8000;
app.listen(PORT,()=>{
    console.log("listening")
})
databaseConnection();

app.use("/category",categoryRouter);
app.use(bodyParser.urlencoded({extended:false}));

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


