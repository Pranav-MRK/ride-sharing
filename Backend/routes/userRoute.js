const express = require("express");
const router = express.Router();
const validateUser = require("../middleware/validateUser");
const userController = require("../controller/userController");
const auth = require("../middleware/auth");
const { route } = require("./authRoutes");


router.use(auth);  // to check the user is autheticated or not

// Get current logged-in user profile
router.get("/me", userController.getProfile);

// Update current logged-in user profile
router.put("/me", userController.updateUser);


// ******.  ADMIN contorolled ********************

// Get all users (Supports pagination via query string: ?page=1&limit=10)
router.get("/", userController.getAllUsers);

// Get specific user by MongoDB _id
router.get("/:id", userController.getUserById);

// Update specific user by ID
router.put("/:id", userController.updateUser);

// Delete user by ID
router.delete("/:id", userController.deleteUser);

module.exports = router;
