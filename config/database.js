const mongoose = require("mongoose");

const databaseConnection = ()=>{
    mongoose.connect(process.env.DATABASE,{
        useNewUrlParser: true,
        family:4
    }).then(()=> console.log("connected to database")).catch(err=> console.log(err));
};

module.exports = databaseConnection;