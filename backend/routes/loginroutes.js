const express=require("express");
const cors=require("cors");
const{login}=require("../controller/loginContoller");

const router =express.Router();
router.use(cors());
router.post("/login",login);
module.exports=router;