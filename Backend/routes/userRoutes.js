const express=require("express");
const { createProductReview } = require("../controllers/productController");
const { userRegister, userLogin, userLogout, forgotPassword, resetPassword, getUserDetails, updatePassword, updateProfile,getAllUser, getSingleUser, updateUserRole, deleteUser} = require("../controllers/userController");
const router=express.Router();

const { isAuthenticatedUser, authorizeRoles } = require("../midware/authentication");


router.route("/register").post(userRegister);


router.route ("/login").post(userLogin); 

router.route("/password/forgot").post(forgotPassword);

router.route("/password/reset/:token").put(resetPassword);

router.route("/me").get(isAuthenticatedUser,getUserDetails);

router.route("/logout").get(userLogout);

router.route("/password/update").put(isAuthenticatedUser,updatePassword);

router.route("/me/update").put(isAuthenticatedUser,updateProfile);

router.route("/admin/users").get(isAuthenticatedUser,authorizeRoles("admin"),getAllUser);

router.route("/admin/user/:id").get(isAuthenticatedUser,authorizeRoles("admin"),getSingleUser);

router.route("/admin/user/:id").put(isAuthenticatedUser,authorizeRoles("admin"),updateUserRole);

router.route("/admin/user/:id").delete(isAuthenticatedUser,authorizeRoles("admin"),deleteUser);








module.exports=router;