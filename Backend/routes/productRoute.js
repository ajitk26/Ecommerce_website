const express=require("express");
const { getAllProducts, createProduct, updateProduct,deleteProduct,getProductDetail,createProductReview, getProductReviews, deleteReview} = require("../controllers/productController");
const { isAuthenticatedUser ,authorizeRoles} = require("../midware/authentication");
const router=express.Router();



router.route("/products").get(isAuthenticatedUser,getAllProducts);

router.route("/admin/product/new").post(isAuthenticatedUser,authorizeRoles("admin"),createProduct);

router.route("/admin/product/:id").put(isAuthenticatedUser,authorizeRoles("admin"),updateProduct);  

router.route("/admin/product/:id").delete(isAuthenticatedUser,authorizeRoles("admin"),deleteProduct);  

router.route("/product/:id").get(getProductDetail);  

router.route("/review").put(isAuthenticatedUser,createProductReview);

router.route("/reviews").get(getProductReviews);

router.route("/reviews").delete(isAuthenticatedUser,deleteReview);




module.exports=router;