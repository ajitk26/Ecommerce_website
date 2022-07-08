class ApiFeatures {
    constructor(query,queryStr){
        this.query=query;
        this.queryStr=queryStr; 
    }

    search(){
        const keyword=this.queryStr.keyword ? {
            name:{
                $regex:this.queryStr.keyword,
                $options:"i",
            },
        }
        :{};
        this.query=this.query.find({...keyword})
        return this;
    }

    filter(){
        const queryCopy={...this.queryStr};
        // Removing the field for category
        const removeFields=["keyword","page","limit"];

        removeFields.forEach((key)=>delete queryCopy[key]);


        //Filter for price and ratings

        console.log(queryCopy);

        let queryStr = JSON.stringify(queryCopy);
    
        queryStr = queryStr.replace(/\b(gt|gte|lt|lte)\b/g, (key) => `$${key}`);

    
        this.query = this.query.find(JSON.parse(queryStr));

        console.log(queryStr);

    
        return this; 
    }
    pagination(resultPerpage){
        const currPage=Number(this.queryStr.page)||1;

        const skip=resultPerpage * (currPage-1);

        this.query=this.query.limit(resultPerpage).skip(skip);
        
        return this;

    }
};


module.exports=ApiFeatures;