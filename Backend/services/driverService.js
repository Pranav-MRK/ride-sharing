const UserRepository = require("../repositories/userRepository");
const DriverRepository = require("../repositories/driverRepository");
const VehicleRepository = require("../repositories/vehicleRepository");
const AppError = require("../errors/appErr");
const { create } = require("../model/userSchema");

class DriverService{
    async registerDriver(userId,driverData){
        // check user exist or not 
        const user = await UserRepository.findUserById(userId);
        if (!user) {
            throw new AppError("User not found!",404);
        }
        
        const existingDriver = await DriverRepository.findByUserId(userId);

        if(existingDriver){
            throw new AppError("Driver is already registerd!",409);
        }

        //. check for new lincence number
        const existlicenseNumber = await DriverRepository.findByLicenseNumber(driverData.licenseNumber);

        if (existlicenseNumber) {
            throw new AppError("License already registered", 409);
        }

        const existvehicleNumber = await VehicleRepository.findByVehicleNumber(driverData.vehicle.vehicleNumber);
        if (existvehicleNumber) {
            throw new AppError("Vehicle already registered", 409);
        }

        const driver = await DriverRepository.createDriver({
            userId,
            licenseNumber: driverData.licenseNumber,
            licenseExpiry: driverData.licenseExpiry,
        })

        const vehicle = await VehicleRepository.createVehicle({
            driverId: driver._id,
            ...driverData.vehicle
        })
        await UserRepository.updateUser(userId, {
            role: "driver"
        });

        return {
            driver,
            vehicle
        };

    }


    async getDriverProfile(userId){
        const driver = await DriverRepository.findByUserId(userId);

        if (!driver) {
            throw new AppError("Driver not found",404);
        }
        const vehicle = await VehicleRepository.findByDriverId(driver._id);
        return{
            driver,
            vehicle
        };
    }

    async updateDriver(userId,updatedData){
        const driver = await DriverRepository.findByUserId(userId);

        if (!driver) {
            throw new AppError("Driver not found",404);
        }
        return await DriverRepository.updateDriver(
            driver._id,
            updatedData
        );
    }

    async updateLocation(userId, longitude, latitude){
        const driver = await DriverRepository.findByUserId(userId);

        if (!driver) {
            throw new AppError("Driver not found",404);
        }

        return await DriverRepository.updateLocation(
            driver._id,
            {
                type: "Point",
                coordinates: [longitude, latitude]
            }
        );
    }

    async updateAvailability(userId, availabilityStatus){
        const driver = await DriverRepository.findByUserId(userId);

        if (!driver) {
            throw new AppError("Driver not found",404);
        }

        return await DriverRepository.updateAvailability(
            driver._id,
            availabilityStatus
        );
    }



}
module.exports = new DriverService();