const driver = require("../model/driverSchema");

class DriverRepository{
    async createDriver(userData){
        return await driver.create(userData);
    }
    async findByUserId(userId){
        return await driver.findOne({ userId });
    }
    async findById(id){
        return await driver.findById(id);
    }

    async updateDriver(id,updateData){
        return await driver.findByIdAndUpdate(id,updateData,{
            new:true,
            runValidators:true,
        })
    }

    async findDriverWithUser(userId) {
        return await driver.findOne({ userId }).populate("userId");
    }

    async updateLocation(driverId, currentLocation) {
        return await driver.findByIdAndUpdate(
            driverId,
            { currentLocation },
            { new: true }
        );
    }

    async updateAvailability(driverId, availabilityStatus) {
        return await driver.findByIdAndUpdate(
            driverId,
            { availabilityStatus },
            { new: true }
        );
    }


    async findByLicenseNumber(licenseNumber) {
        return await driver.findOne({ licenseNumber });
    }

    async deleteDriver(id){
        return await driver.findByIdAndDelete(id);
    }

}
module.exports = new DriverRepository();