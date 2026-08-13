const userService = require("../services/userService");
const asyncWrapper = require("../utils/asyncWrapper");

class UserController {
    // 1. Register / Create User
    registerUser = asyncWrapper(async (req, res) => {
        const user = await userService.registerUser(req.body);

        res.status(201).json({
            success: true,
            message: "User registered successfully",
            data: user
        });
    });

    // 2. Login User
    loginUser = asyncWrapper(async (req, res) => {
        const result = await userService.loginUser(req.body);

        res.status(200).json({
            success: true,
            message: "Login successful",
            data: result
        });
    });

    // 3. Get Current Logged-in User Profile
    getProfile = asyncWrapper(async (req, res) => {
        const user = await userService.getUserById(req.user.id);

        res.status(200).json({
            success: true,
            data: user
        });
    });

    // 4. Get All Users (Admin / List view)
    getAllUsers = asyncWrapper(async (req, res) => {
        const users = await userService.getAllUser(req.query);

        res.status(200).json({
            success: true,
            data: users
        });
    });

    // 5. Get Single User By Param ID
    getUserById = asyncWrapper(async (req, res) => {
        const user = await userService.getUserById(req.params.id);

        res.status(200).json({
            success: true,
            data: user
        });
    });

    //  update the the user profile 
    updateUser = asyncWrapper(async (req, res) => {
        // Accepts ID from URL params, or falls back to authenticated req.user.id
        const userId = req.params.id || req.user.id;
        const updatedUser = await userService.updateUser(userId, req.body);

        res.status(200).json({
            success: true,
            message: "User updated successfully",
            data: updatedUser
        });
    });

    // 7. Delete User
    deleteUser = asyncWrapper(async (req, res) => {
        const userId = req.params.id || req.user.id;
        const result = await userService.deleteUser(userId);

        res.status(200).json({
            success: true,
            message: result.message
        });
    });
}

module.exports = new UserController();