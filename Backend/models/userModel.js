const mongoose=require("mongoose");

const validator=require("validator");

const bcrypt=require("bcryptjs");
const jwt=require("jsonwebtoken");

const crypto=require("crypto");

const userSchema=new mongoose.Schema({

    name:{
        type:String,
        required:[true,"Please enter your name"],
        maxLength:[30,"Name cannot exceed 30 character"],
        minLength:[4,"Name should have more than 4 character"]

    },

    email:{
        type:String,
        required:[true,"Please enter your email"],
        unique:true,
        validate:[validator.isEmail,"Please enter a valid password"]
    },

    password:{
        type:String,
        required:[true,"Please enter your password"],
        minLength:[8,"Password should be greater than 8 characters"],
        select:false
    },

    avatar:{
        public_id:{
            type:String,
            required:true
        },
        url:{
            type:String,
            required:true
        }
    },

    role:{
        type:String,
        default:"user",

    },
    resetPassToken:String,
    resetPassExpire:Date,

});
userSchema.pre("save", async function(next){

    if(!this.isModified("password")){
        next();

    }

    this.password= await bcrypt.hash(this.password,10)
});

// JWT token for stories user data in cookies

userSchema.methods.getJWTToken=function(){
    return jwt.sign({id:this._id},process.env.JWT_SECRET,{
        expiresIn:process.env.JWT_EXPIRE, 
    });
};

//Compare password

userSchema.methods.comparePassword = async function(password){
    return await bcrypt.compare(password,this.password);
};

//Generating token for resetting password

userSchema.methods.getResetPasswordToken=function(){
    
    //generating token

    const resetToken=crypto.randomBytes(20).toString("hex");

    //Hashing and add to userSchema
    this.resetPassToken=crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");

    this.resetPassExpire=Date.now()+ 15 * 60 *1000;

    return resetToken;
}


module.exports=mongoose.model("User",userSchema);