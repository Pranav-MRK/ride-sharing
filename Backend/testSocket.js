const { io } = require("socket.io-client");

const DRIVER_TOKEN = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjZhN2M4YzEzZDVhZTk4ZjBlNWU2NGNjZSIsImVtYWlsIjoiYWpheUByaWRlLmNvbSIsInBob25lIjoiOTg3NjU0MzIxMCIsInJvbGUiOiJkcml2ZXIiLCJpYXQiOjE3ODgwMzIwNDUsImV4cCI6MTc4ODExODQ0NX0.aNhCFcA6eyXKaxv8yGOepVGq_PKOBLJ65f6NBJZAHiI";

const socket = io("http://localhost:8080", {
    auth: {
        token: DRIVER_TOKEN
    }
});


socket.on("connect", () => {

    console.log(
        "Connected:",
        socket.id
    );


    // Send driver location
    socket.emit(
        "driver:location:update",
        {
            longitude: 73.9412,
            latitude: 18.4578
        }
    );

});


socket.on(
    "driver:location:updated",
    (data) => {

        console.log(
            "Location updated:",
            data
        );

    }
);


socket.on(
    "driver:location:error",
    (error) => {

        console.log(
            "Location error:",
            error
        );

    }
);


socket.on("connect_error", (error) => {

    console.log(
        "Socket connection error:",
        error.message
    );

});