const jwt = require("jsonwebtoken");
const driverRepository = require("../repositories/driverRepository");

const initializeSocket = (io) => {

    // Socket authentication middleware
    io.use(async (socket, next) => {

        try {

            const token = socket.handshake.auth.token;

            if (!token) {
                return next(
                    new Error("Authentication token required")
                );
            }

            const decoded = jwt.verify(
                token,
                process.env.JWT_SECRET
            );

            socket.userId = decoded.id || decoded.userId;

            if (!socket.userId) {
                return next(
                    new Error("Invalid token")
                );
            }

            next();

        } catch (error) {

            next(
                new Error("Invalid or expired token")
            );

        }

    });


    io.on("connection", async (socket) => {

        console.log(
            "Authenticated socket connected:",
            socket.id
        );

        console.log(
            "User ID:",
            socket.userId
        );


        // Driver location update
        socket.on("driver:location:update", async (data) => {

            try {

                const { longitude, latitude } = data;

                // Validate coordinates
                if (
                    typeof longitude !== "number" ||
                    typeof latitude !== "number"
                ) {
                    return socket.emit(
                        "driver:location:error",
                        {
                            message:
                                "Longitude and latitude must be numbers"
                        }
                    );
                }

                if (
                    longitude < -180 ||
                    longitude > 180 ||
                    latitude < -90 ||
                    latitude > 90
                ) {
                    return socket.emit(
                        "driver:location:error",
                        {
                            message:
                                "Invalid latitude or longitude"
                        }
                    );
                }


                // Find driver using logged-in user
                const driver =
                    await driverRepository.findByUserId(
                        socket.userId
                    );

                if (!driver) {

                    return socket.emit(
                        "driver:location:error",
                        {
                            message:
                                "Driver profile not found"
                        }
                    );

                }


                // Driver must be approved
                if (driver.status !== "approved") {

                    return socket.emit(
                        "driver:location:error",
                        {
                            message:
                                "Driver is not approved"
                        }
                    );

                }


                // Update driver location
                const updatedDriver =
                    await driverRepository.updateDriver(
                        driver._id,
                        {
                            currentLocation: {
                                type: "Point",
                                coordinates: [
                                    longitude,
                                    latitude
                                ]
                            },
                            lastSeen: new Date()
                        }
                    );


                socket.emit(
                    "driver:location:updated",
                    {
                        success: true,
                        location:
                            updatedDriver.currentLocation,
                        lastSeen:
                            updatedDriver.lastSeen
                    }
                );

            } catch (error) {

                console.error(
                    "Location update error:",
                    error
                );

                socket.emit(
                    "driver:location:error",
                    {
                        message:
                            "Failed to update driver location"
                    }
                );

            }

        });


        socket.on("disconnect", () => {

            console.log(
                "Socket disconnected:",
                socket.id
            );

        });

    });

};

module.exports = initializeSocket;