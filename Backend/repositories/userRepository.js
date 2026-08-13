const User = require("../model/userSchema");
class UserRepository{
    async createUser(userData){
        return await User.create(userData);
    }
    async findUserById(id){
        return await User.findById(id);
    }
    async findAll(){
        return await User.find();
    }
    async findByphone(phone){
        return await User.findOne({phone}).select("+password");
    }
    async findByemail(email){
        return await User.findOne({email}).select("+password");
    }
    async updateUser(id,updatData){
        return await User.findByIdAndUpdate(id,updatData,{
            new:true, // accept the new schema 
            runValidators:true  // to ensure to maintain schema is correct 
        });

    }

    async deleteUser(id){
        return await User.findByIdAndDelete(id);

    }

}
module.exports = new UserRepository();