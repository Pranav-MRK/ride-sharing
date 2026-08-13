const vehicle = require("../model/vehicleSchema");

class VehicleRepository {

    async createVehicle(vehicleData) {
        return await vehicle.create(vehicleData);
    }

    async findByDriverId(driverId) {
        return await vehicle.findOne({ driverId });
    }

    async findByVehicleNumber(vehicleNumber) {
        return await vehicle.findOne({ vehicleNumber });
    }

    async updateVehicle(id, updatedData) {
        return await vehicle.findByIdAndUpdate(
            id,
            updatedData,
            {
                new:true,
                runValidators: true
            }
        );
    }

}

module.exports = new VehicleRepository();