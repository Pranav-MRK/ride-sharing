const express = require("express");

const router = express.Router();

const rideController = require("../controller/rideController");

const auth = require("../middleware/auth");

const validateRide = require("../middleware/validateRide");

const validateCancelRide = require("../middleware/validateCancelRide");


router.post("/",auth,validateRide,rideController.createRide);
router.get("/",auth,rideController.getRiderRides);

router.get("/:id",auth,rideController.getRideById);
router.patch("/:id/accept",auth,rideController.acceptRide);
router.patch("/:id/cancle",auth,validateCancelRide,rideController.cancleRide);
router.get( "/:id/nearby-drivers",auth,rideController.findNearbyDrivers);
router.patch(
    "/:id/arriving",
    auth,
    rideController.driverArriving
);

router.patch(
    "/:id/start",
    auth,
    rideController.startRide
);

router.patch(
    "/:id/complete",
    auth,
    rideController.completeRide
);

module.exports = router;