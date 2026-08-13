const reqinfo = (req,res,next)=>{
    req.requestTime = new Date().toISOString();
    console.log("Request time set");
    next();
} 
module.exports = reqinfo;