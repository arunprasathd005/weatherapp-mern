const express=require("express");
const signupController= require("../controller/signupContoller");
const router =express.Router();
router.post("/register",signupController.createUser);
module.exports=router;