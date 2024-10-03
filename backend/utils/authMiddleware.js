const jwt=require("jsonwebtoken");
const secretKey =require("../configuration/jwtconfig");

function authenticaeToken(req,res,next) {
    const authHeader =req.header("Authorization");
    if(!authHeader){
        return res.status(401).json({message:"Unauthorized:Missing token!"});
    }
    const [bearer,token]=authHeader.split(" ");
    if(bearer!=="Bearer" || !token){
        return res.status(401).json({message:"Unauthorized:Invalid token!"});
    }
    jwt.verify(token,secretKey,(err,user)=>{
        if(err){
            return res.status(401).json({message:"Unauthorized:Invalid token!"});
        }
        req.user=user;
        next();
    })
    
}
module.exports={authenticaeToken};