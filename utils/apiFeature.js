class ApiFeature{
    constructor(mongooseQuery,queryStr){
        this.mongooseQuery = mongooseQuery;
        this.queryStr = queryStr;
    }

    filter(){
        const queryStringObj = {...this.queryStr};
        const excludedField = ['page','limit','sort','field'];
        excludedField.forEach(field => delete queryStringObj[field]);

        let queryString = JSON.stringify(queryStringObj);
        queryString = queryString.replace(/\b(gte|gt|lt|lte)\b/g,match => `$${match}`);

        this.mongooseQuery = this.mongooseQuery.find(JSON.parse(queryString));
        return this;
    }

    sort(){
        if(this.queryStr.sort){
            const sortBy = this.queryStr.sort.split(',').join(' ');
            this.mongooseQuery = this.mongooseQuery.sort(sortBy);
        }else{
            this.mongooseQuery = this.mongooseQuery.sort("-createdAt");
        }
        return this;
    }

    limitFields(){
        if(this.queryStr.field){
            const field = this.queryStr.field.split(',').join(' ');
            this.mongooseQuery = this.mongooseQuery.select(field);
        }else{
            this.mongooseQuery = this.mongooseQuery.select("-__v");
        }
        return this;
    }

    search(modelName){
        if(this.queryStr.keyword){
            let query = {};
            if(modelName === "Product"){
                query.$or =[
                    {title:{$regex:this.queryStr.keyword,$options:"i"}},
                    {description:{$regex:this.queryStr.keyword,$options:"i"}}
                ];
            }else{
                query = {name:{$regex:this.queryStr.keyword, $options:"i"}}
            }
            this.mongooseQuery = this.mongooseQuery.find(query);
        }
        return this;
    }

    paginate(countDocuments){
        const page = this.queryStr.page * 1 || 1;
        const limit = this.queryStr.limit * 1 || 50;
        const skip = (page - 1) * limit;
        const endPageIndex = page * limit;
        
        const pagination = {};
        pagination.currentPage = page;
        pagination.limit =limit;

        pagination.numberOfPages =  Math.ceil(countDocuments/limit) ;

        if(endPageIndex < countDocuments){
            pagination.next = page +1;
        }
        if(skip >0){
            pagination.previous = page -1;
        }


        this.mongooseQuery = this.mongooseQuery.skip(skip).limit(limit);
        this.paginationResult = pagination;
        return this;
    }

}

module.exports = ApiFeature;