const RideService = require("../services/rideService");
const asyncWrapper = require("../utils/asyncWrapper");
class RideController{
    createRide = asyncWrapper(async(req,res)=>{
        const ride = await RideService.createRide(req.user.id,req.body);

        res.status(201).json({
            success: true,
            message:"ride created successfully",
            data:ride,
        })
    })

    getRideById = asyncWrapper(async(req,res)=>{
        const ride = await RideService.getRideById(req.params.id,req.user.id);

        res.status(200).json({
            success:true,
            data:ride
        })
    })

    getRiderRides = asyncWrapper(async(req,res)=>{
        const ride = await RideService.getRiderRides(req.user.id);
        
        res.status(200).json({
            success:true,
            data:ride
        })

    })
    findNearbyDrivers = asyncWrapper(async (req, res) => {

        const drivers = await RideService.findNearbyDrivers(
            req.params.id
        );

        res.status(200).json({
            success: true,
            message: "Nearby drivers found",
            data: drivers
        });
    });

    cancleRide = asyncWrapper(async(req,res)=>{
        const ride = await RideService.cancelRide(req.params.id,req.user.id,req.body.reason);
        res.status(200).json({
            success:true,
            message:"Ride has been cancaled !",
            data:ride
        })
    })

    acceptRide = asyncWrapper(async (req, res) => {

        const ride = await RideService.acceptRide(
            req.params.id,
            req.user.id
        );

        res.status(200).json({
            success: true,
            message: "Ride accepted successfully",
            data: ride
        });
    });


    driverArriving = asyncWrapper(async (req, res) => {

        const ride = await RideService.transitionRide(
            req.params.id,
            req.user.id,
            "driver_arriving"
        );

        res.status(200).json({
            success: true,
            message: "Driver is arriving",
            data: ride
        });
    });


    startRide = asyncWrapper(async (req, res) => {

        const ride = await RideService.transitionRide(
            req.params.id,
            req.user.id,
            "started"
        );

        res.status(200).json({
            success: true,
            message: "Ride started",
            data: ride
        });
    });


    completeRide = asyncWrapper(async (req, res) => {

        const ride = await RideService.transitionRide(
            req.params.id,
            req.user.id,
            "completed"
        );

        res.status(200).json({
            success: true,
            message: "Ride completed",
            data: ride
        });
    });
}

module.exports = new RideController();