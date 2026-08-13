const express = require("express");
const router = express.Router();

const validateDriver = require("../middleware/validateDriver");
const DriverController = require("../controller/driverController");
const auth = require("../middleware/auth");


router.post("/register",auth,validateDriver,DriverController.registerDriver);
router.get("/me",auth,DriverController.getDriverProfile);
router.patch("/me",auth,DriverController.updateDriver);
router.patch("/location",auth,DriverController.updateLocation);
router.patch("/availability",auth,DriverController.updateAvailability);


module.exports = router;