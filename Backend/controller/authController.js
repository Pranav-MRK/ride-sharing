const asyncWrapper = require("../utils/asyncWrapper");
const userService = require("../services/userService");


class AuthController{
    signup = asyncWrapper(async(req,res,next)=>{
        const user = await userService.registerUser(req.body);
        res.status(201).json({
            success: true,
            message: "User registered successfully",
            data:{
                id: user._id,
                name: user.name,
                email: user.email,
                phone:user.phone,
                role: user.role,
            }
        })

    })
    login = asyncWrapper(async (req, res, next) => {
        const { token, user } = await userService.loginUser(req.body);
        res.status(200).json({
            success: true,
            message: "Welcome! Logged in successfully",
            token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                phone:user.phone,
                role: user.role,
            }
        });
    });
}

module.exports = new AuthController();