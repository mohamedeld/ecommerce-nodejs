const express = require("express");
const dotenv = require("dotenv");
const morgan = require("morgan");
const ApiError = require("./utils/ApiError");
const globalError = require("./middleware/errorMW");
const databaseConnection = require("./config/database");
const categoryRouter = require("./routes/categoryRoutes");
const bodyParser =require("body-parser");
const app = express();
app.use(express.json());
dotenv.config({path:"./config.env"});

app.use(bodyParser.urlencoded({extended:false}));

if(process.env.NODE_ENV === 'development'){
    app.use(morgan("dev"));
}

databaseConnection();
const PORT = process.env.PORT || 8000;
const server = app.listen(PORT,()=>{
    console.log("listening")
})

app.use("/category",categoryRouter);

app.all("*",(request,response,next)=>{
    next(new ApiError(`cant find this route ${request.originalUrl}`,400));
})

app.use((request,response,next)=>{
    response.status(404).json({
        message:"Page Not Found"
    })
});

app.use(globalError);

// error outside express
process.on("unhandledRejection",(error)=>{
    console.log(`UnhandledRejection ${error}`);
    server.close(()=>{
        console.error("Shut down...")
        process.exit(1);
    })
})