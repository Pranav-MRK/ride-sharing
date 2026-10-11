const AppError = require("../errors/appErr");
const rideRepository = require("../repositories/rideRepository");
const userRepository = require("../repositories/userRepository");
const driverRepository = require("../repositories/driverRepository");

class RideService{
    
    async createRide(riderId, rideData) {

        // 1. Check rider exists
        const rider = await userRepository.findUserById(riderId);

        if (!rider) {
            throw new AppError("Rider not found", 404);
        }

        // 2. Check rider is not blocked
        if (rider.isBlocked) {
            throw new AppError(
                "Blocked user cannot book ride.",
                403
            );
        }

        // 3. Create ride
        const ridePayload = {
            riderId,
            vehicleType: rideData.vehicleType,
            pickup: rideData.pickup,
            destination: rideData.destination,
            status: "requested"
        };

        const ride = await rideRepository.createRide(
            ridePayload
        );

        // 4. Move ride into driver searching state
        const searchingRide = await rideRepository.updateRide(
            ride._id,
            {
                status: "searching"
            }
        );

        return searchingRide;
    }

    async getRideById(rideId, userId){
        const ride = await rideRepository.findById(rideId);

        if (!ride) {
            throw new AppError("Ride not found", 404);
        }

        const isRider = ride.riderId.toString() === userId.toString();

        const isDriver = ride.driverId && ride.driverId.toString() === userId.toString();
        if (!isRider && !isDriver) {
            throw new AppError(
                "You are not authorized to view this ride",
                403
            );
        }
        return ride;
    }
    async getRiderRides(riderId) {

        return await rideRepository.findByRiderId(
            riderId
        );
    }

    async cancelRide(rideId, riderId, reason) {

        const ride = await rideRepository.findById(rideId);

        if (!ride) {
            throw new AppError(
                "Ride not found",
                404
            );
        }

        // Authorization
        if (
            ride.riderId.toString() !==
            riderId.toString()
        ) {
            throw new AppError(
                "You are not allowed to cancel this ride",
                403
            );
        }

        // State validation
        const cancellableStates = [
            "requested",
            "searching",
            "driver_assigned",
            "driver_arriving"
        ];

        if (!cancellableStates.includes(ride.status)) {
            throw new AppError(
                "Ride cannot be cancelled at this stage",
                400
            );
        }

        return await rideRepository.cancelRide(
            rideId,
            reason
        );
    }



    async  findNearbyDrivers(rideId){
        //  check ride is avaliable or not
        console.log("FIND DRIVERS RIDE ID:", rideId);
        const ride = await rideRepository.findById(rideId);
        console.log("FOUND RIDE:", ride);
        
        if (!ride) {
            throw new AppError("Ride not found", 404);
        }
        //  check ride status
        if (ride.status !== "searching") {
            throw new AppError(
                "Ride is not currently searching for a driver",
                400
            );
        }

        //  store coordinates
        const coordinates = ride.pickup.location.coordinates;
        const[longitude,latitude]=coordinates;


        //  find matching drivers
        const drivers = await driverRepository.findNearByDriver(longitude,latitude,ride.vehicleType,5000);
        // 5. No drivers available
        if (!drivers.length) {
            throw new AppError(
                "No nearby drivers available",
                404
            );
        }
        return drivers;

    }


    async acceptRide (rideId,userId){
        //  check driverexist or not 
        const driver = await driverRepository.findByUserId(userId);
        if (!driver) {
            throw new AppError("Driver not found",404)
        }

        //  driver status must be approved 
        if(driver.status !== 'approved'){
            throw new AppError(
                "Driver is not approved",
                403
            );
        }
        // 3. Driver must be online
        if (driver.availabilityStatus !== "online") {
            throw new AppError(
                "Driver is not available",
                400
            );
        }

        const ride = await rideRepository.assignDriver(rideId,driver._id);

        //  check if is it already accepted by anyone else
        if (!ride) {
            throw new AppError("Ride has already been accepted by another driver",409)
        }
        return ride;
    }

    async transitionRide(rideId, userId, nextStatus) {

        const ride = await rideRepository.findById(rideId);

        if (!ride) {
            throw new AppError("Ride not found", 404);
        }

        // Find driver using logged-in user's ID
        const driver = await driverRepository.findByUserId(userId);

        if (!driver) {
            throw new AppError(
                "Driver profile not found",
                404
            );
        }

        // Driver must be assigned to this ride
        if (
            !ride.driverId ||
            ride.driverId.toString() !== driver._id.toString()
        ) {
            throw new AppError(
                "You are not assigned to this ride",
                403
            );
        }

        // Allowed ride state transitions
        const transitions = {
            driver_assigned: ["driver_arriving"],
            driver_arriving: ["started"],
            started: ["completed"]
        };

        const allowedNextStates =
            transitions[ride.status] || [];

        if (!allowedNextStates.includes(nextStatus)) {
            throw new AppError(
                `Cannot change ride status from ${ride.status} to ${nextStatus}`,
                400
            );
        }

        // Prepare update
        const updateData = {
            status: nextStatus
        };

        if (nextStatus === "driver_arriving") {
            updateData.arrivingAt = new Date();
        }

        if (nextStatus === "started") {
            updateData.startedAt = new Date();
        }

        if (nextStatus === "completed") {

            updateData.completedAt = new Date();

            // Driver becomes available again
            await driverRepository.updateAvailability(
                driver._id,
                "online"
            );
        }

        return await rideRepository.updateRide(
            rideId,
            updateData
        );
    }
    
}

module.exports = new RideService();