const ErrorHandler = require("../utils/errorHandler");
const catchAsyncError=require("../midware/catchAsyncError");
const User=require("../models/userModel");
const sendToken = require("../utils/jwtToken");
const sendEmail=require("../utils/sendEmail")
const crypto=require("crypto");

//User registration

exports.userRegister=catchAsyncError(async(req,res,next)=>{
    
    const{name,email,password}= req.body;

    const user= await User.create({
        name,email,password,
        avatar:{
            public_id:"this is a sample id",
            url:"profilepicUrl",
        }
    });
    sendToken(user,201,res);
});

//user login

exports.userLogin=catchAsyncError(async (req,res,next)=>{

    const {email,password}=req.body;

    //check whether user has entered the email and password 
    if(!email || !password){
        return next(new ErrorHandler("Please enter email and password",400));
    }

    const user= await User.findOne({email}).select("+password");

    if(!user){
        return next(new ErrorHandler("Invalid email or password",401));
    }

    const passwordMatched= await user.comparePassword(password);

    if(!passwordMatched){
        return next(new ErrorHandler("Invalid email or password",401));
    }
    sendToken(user,200,res);
});

//User logout

exports.userLogout=catchAsyncError(async (req,res,next)=>{

    res.cookie("token",null,{
        expires:new Date(Date.now()),
        httpOnly:true
    });

    res.status(200).json({
        success:true,
        message:"Logged out successfully    "
   });
});

//Forgot password

exports.forgotPassword=catchAsyncError(async(req,res,next)=>{

    const user=await User.findOne({email:req.body.email});

    if(!user){
        return next(new ErrorHandler("User not found",404));
    }

    //Get reset password token

    const resetToken=user.getResetPasswordToken();

    await user.save({validateBeforeSave:false});


    const resetPasswordlink=`${req.protocol}://${req.get("host")}/api/v1/password/reset/${resetToken}`;

    const message=`Your reset password token is :- \n\n ${resetPasswordlink} \n\n If you have not requested this email then, please ignore it `;

    try {

        await sendEmail({
            email:user.email,
            subject:'password recovery', 
            message,

        });

        res.status(200).json({
            success:true,
            message:`Email sent to ${user.email} successfully`,
        })
        
    } catch (error) {
        user.resetPassToken=undefined;
        user.resetPassExpire=undefined;

        await user.save({validateBeforeSave:false});

        return next(new ErrorHandler(error.message, 500));

        
    }
});

//Reset Password

exports.resetPassword=catchAsyncError(async(req,res,next)=>{
    
     //Creating token hash

    const resetPassToken=crypto
    .createHash("sha256")
    .update(req.params.token)
    .digest("hex");

    const user=await User.findOne({
        resetPassToken,
        resetPassExpire:{$gt:Date.now()},
    });

    if(!user){
        return next (new ErrorHandler("Reset password link is invalid or has been expired"),400);
    }

    if(req.body.password!== req.body.confirmPassword){
        return next(new ErrorHandler("Password doesn't match",400));
    }

    user.password=req.body.password;
    user.resetPassToken=undefined;
    user.resetPassExpire=undefined; 

    await user.save();

    sendToken(user,200,res);

});

//Get user details
exports.getUserDetails = catchAsyncError(async (req, res, next) => {
    
    const user = await User.findById(req.user.id);
  
    res.status(200).json({
      success: true,
      user,
    });
  });

  // update User password
exports.updatePassword = catchAsyncError(async (req, res, next) => {
    const user = await User.findById(req.user.id).select("+password");
  
    const isPasswordMatched = await user.comparePassword(req.body.oldPassword);
  
    if (!isPasswordMatched) {
      return next(new ErrorHandler("Old password is incorrect", 400));
    }
  
    if (req.body.newPassword !== req.body.confirmPassword) {
      return next(new ErrorHandler("password does not match", 400));
    }
  
    user.password = req.body.newPassword;
  
    await user.save();
  
    sendToken(user, 200, res);
  });


  // update User Profile

exports.updateProfile = catchAsyncError(async (req, res, next) => {
    const newUserData = {
      name: req.body.name,
      email: req.body.email,
    };

    // We wil add cloudinary later

    const user= await User.findByIdAndUpdate(req.user.id,newUserData,{
        new:true,
        runValidators:true,
        userFindAndModify:false,
    });

    res.status(200).json({
        success:true,

    }); 
});
  


// Get all users(admin)
exports.getAllUser = catchAsyncError(async (req, res, next) => {
    const users = await User.find();
  
    res.status(200).json({
      success: true,
      users,
    });
  });


  // Get single user (admin)
exports.getSingleUser = catchAsyncError(async (req, res, next) => {
    const user = await User.findById(req.params.id);
  
    if (!user) {
      return next(new ErrorHandler(`User does not exist with Id: ${req.params.id}`));
    }
  
    res.status(200).json({
      success: true,
      user,
    });
  });


// update User Role -- Admin
exports.updateUserRole = catchAsyncError(async (req, res, next) => {
    const newUserData = {
      name: req.body.name,
      email: req.body.email,
      role: req.body.role,
    };
  
    await User.findByIdAndUpdate(req.params.id, newUserData, {
      new: true,
      runValidators: true,
      useFindAndModify: false,
    });
  
    res.status(200).json({
      success: true,
    });
  });


// Delete User --Admin
exports.deleteUser = catchAsyncError(async (req, res, next) => {
    const user = await User.findById(req.params.id);
  
    if (!user) {
      return next(
        new ErrorHandler(`User does not exist with Id: ${req.params.id}`, 400)
      );
    }
  
  
    await user.remove();
  
    res.status(200).json({
      success: true,
      message: "User Deleted Successfully",
    });
  });




 