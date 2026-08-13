const express = require("express");
const router = express.Router();
const authController = require("../controller/authController");
const validateUser = require("../middleware/validateUser");
const validateAuth = require("../middleware/validateAuth");

router.post("/signup",validateUser,authController.signup);

router.post("/login",validateAuth,authController.login);

module.exports = router;