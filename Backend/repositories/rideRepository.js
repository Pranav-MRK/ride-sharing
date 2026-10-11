const Ride = require("../model/rideSchema");



class RideRepository{
    async createRide(rideData){
        return await Ride.create(rideData);
    }
    async findById(id){
        return await Ride.findById(id);
    }

    async findByRiderId(riderId) {
        return await Ride.find({ riderId }).sort({ createdAt: -1 });
    }

    async findByDriverId(driverId){
        return await Ride.findOne({driverId}).sort({createdAt:-1});
    }
    async updateRide(id, updateData) {
        return await Ride.findByIdAndUpdate(
            id,
            updateData,
            {
                new: true,
                runValidators: true
            }
        );
    }
    async cancelRide(id, cancellationData){
        return await Ride.findByIdAndUpdate(id,
            {
                status: "cancelled",
                cancelledAt: new Date(),
                cancellationReason: cancellationData
            },
            {
                new: true,
                runValidators: true
            }
    
        )
    }

    async assignDriver(id, driverId) {
        return await Ride.findOneAndUpdate(
            {
                _id: id,
                status: "searching",
                driverId: null
            },
            {
                driverId,
                status: "driver_assigned",
                acceptedAt: new Date()
            },
            {
                new: true
            }
        );
    }

    
}

module.exports = new RideRepository();