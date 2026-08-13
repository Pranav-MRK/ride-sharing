const driverService = require("../services/driverService");
const asyncWrapper = require("../utils/asyncWrapper");

class DriverController {

    registerDriver = asyncWrapper(async (req, res) => {

        const result = await driverService.registerDriver(
            req.user.id,
            req.body
        );

        res.status(201).json({
            success: true,
            message: "Driver registered successfully",
            data: result
        });
    });

    getDriverProfile = asyncWrapper(async(req,res)=>{
        const data = await driverService.getDriverProfile(req.user.id);

        res.status(201).json({
            success:true,
            data:data
        });
    })

    updateDriver = asyncWrapper(async(req,res)=>{
        const driver = await driverService.updateDriver(
            req.user.id,
            req.body,
        )

        res.status(201).json({
            success:true,
            message:"Driver updated successfully",
            data:driver,
        })
    })

    updateLocation = asyncWrapper(async(req,res)=>{

        const {longitude,latitude} = req.body;

        const driver = await driverService.updateLocation(
            req.user.id,
            longitude,
            latitude
        );

        res.status(200).json({
            success:true,
            message:"Location updated",
            data:driver
        });

    });

    updateAvailability = asyncWrapper(async(req,res)=>{

        const {availabilityStatus} = req.body;

        const driver = await driverService.updateAvailability(
            req.user.id,
            availabilityStatus
        );

        res.status(200).json({
            success:true,
            message:"Availability updated",
            data:driver
        });

    });

}

module.exports = new DriverController();