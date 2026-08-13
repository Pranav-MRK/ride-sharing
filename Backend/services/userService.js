const bcrypt = require("bcrypt");
const generateToken = require("../utils/jwt");
const AppError = require("../errors/appErr");
const userRepository = require("../repositories/userRepository");
const validateUser = require("../middleware/validateUser");

class UserService {
    async createUser(userData) {
        const hashedPassword = await bcrypt.hash(userData.password, 10);
        const user = await userRepository.createUser({
            ...userData,
            password: hashedPassword
        });
        
        // Convert to object and remove password
        const userObj = user.toObject();
        delete userObj.password;
        
        return userObj;

    }
  
    async getAllUser(queryParams) {
        const { page = 1, limit = 10, sort, order } = queryParams;
        return await userRepository.findAll({
            page: Number(page),
            limit: Number(limit),
            sort,
            order
        });
    }

    // 3. Get User By ID
    async getUserById(id) {
        const user = await userRepository.findUserById(id);
        if (!user) {
            throw new AppError("User not found", 404);
        }
        return user;
    }

    async updateUser(id,updateData){
        if(updateData.password){
            delete updateData.password;
        }
        const user = await userRepository.updateUser(id,updateData);
        if (!user) {
            throw new AppError("User not found", 404);
        }
        return user;

    }
    async deleteUser(id){
        const user = await userRepository.deleteUser(id);
        if (!user) {
            throw new AppError("User not found",404);
        }
        return {message:"User deleted successfully..!"};
    }

    async registerUser(userData){
        const{email,phone,password} = userData;

        const existingUser = await userRepository.findByemail(userData.email);

        if (existingUser) {
            throw new AppError("Email already registered",400);
        }
        const phoneUser = await userRepository.findByphone(userData.phone);

        if(phoneUser){
            throw new AppError("Phone already registered",400);
        }

        const hashedPassword = await bcrypt.hash(password,10);

        const user = await userRepository.createUser({
            ...userData,
            password: hashedPassword,
        })
        return user;

    }
    async loginUser({email,password}){

        const user = await userRepository.findByemail(email);

        if (!user) {
            throw new AppError("Invalid crediantials",401);
        }

        const isMatch = await bcrypt.compare(password,user.password);
        if (!isMatch) {
            throw new AppError("Invalid credentials", 401);
        }

        const token = generateToken({
            id: user._id,
            email: user.email,
            phone: user.phone,
            role: user.role
        });

        user.password = undefined;
        console.log(user);

        return { token, user };

    }

}

module.exports = new UserService();