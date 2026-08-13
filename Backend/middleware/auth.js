const jwt = require("jsonwebtoken");
const AppError = require("../errors/appErr");

const auth = (req,res,next)=>{
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            return next(new AppError("Authentication required", 401));
        }

        // token extract
        const token = authHeader.split(" ")[1];
        console.log("Token received:", token);
        console.log("Secret used:", process.env.JWT_SECRET); 

        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        req.user = decoded;
        next();

    } catch (error) {
        console.error("JWT Error:", error.message);
        return next(new AppError("Invalid or expired token", 401));
    }
}

module.exports = auth;
