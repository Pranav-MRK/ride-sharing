require("dotenv").config();

const express = require("express");
const http = require("http");
const { Server } = require("socket.io");

const logger = require("./middleware/logger");
const connectDB = require("./config/db");
const errorHandler = require("./middleware/errorHandler");
const reqinfo = require("./middleware/reqinfo");
const initializeSocket = require("./Socket/socket");

const authRoutes = require("./routes/authRoutes");
const userRoutes = require("./routes/userRoute");
const driverRoutes = require("./routes/driverRoutes");
const rideRoutes = require("./routes/rideRoutes");

const app = express();

const PORT = 8080;

// Create HTTP server
const server = http.createServer(app);

// Create Socket.io server
const io = new Server(server, {
    cors: {
        origin: "*"
    }
});
initializeSocket(io);



// Middleware

app.use(express.json());
app.use(logger);
app.use(reqinfo);


// Routes
app.use("/api/auth", authRoutes);
app.use("/api/", userRoutes);
app.use("/api/drivers", driverRoutes);
app.use("/api/rides", rideRoutes);


// Wrong routes


app.use((req, res, next) => {
    res.status(404).json({
        status: "error",
        message: "Route not found"
    });
});



// Socket.io


// io.on("connection", (socket) => {

//     console.log(
//         "Socket connected:",
//         socket.id
//     );

//     socket.on("disconnect", () => {

//         console.log(
//             "Socket disconnected:",
//             socket.id
//         );

//     });

// });



// Error Handler
app.use(errorHandler);



// Database + Server


connectDB();

server.listen(PORT, () => {

    console.log(
        `Server listening on port ${PORT}.....!`
    );

});