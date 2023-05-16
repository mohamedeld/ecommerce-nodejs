const {validationResult} = require("express-validator");

module.exports = (request,response,next)=>{
    const result = validationResult(request);
    if(result.errors.length !== 0){
        const errorString = result.errors.reduce(
            (current, obj) => `${current + obj.message  },`,"");
        const error = new Error(errorString);
        error.status = 422;
        next(error);
    }else{
        next();
    }
}