const logger = (req,res,next)=>{
    console.log(`${req.method} ${req.url} - ➡️ Incoming request`);
    next();
}
module.exports = logger;