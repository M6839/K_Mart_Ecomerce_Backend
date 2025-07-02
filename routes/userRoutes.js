const userController=require("../controllers/userController");
const express=require("express");
const {authenticateJWT}=require('../middlewares/authmiddleware')
const Router=express.Router();
Router.post('/register',userController.userRegister);
Router.post('/login',userController.userLogin)
Router.post('/forgotpassword',userController.forgotpassword)
Router.post('/logout',userController.userlogout)
Router.get("/verifyuser",authenticateJWT)
module.exports=Router;