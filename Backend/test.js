// Backend/testRideModel.js
const mongoose = require("mongoose");
require("dotenv").config(); // Load environment variables (.env)

const Ride = require("./model/rideSchema");

async function runMongooseTest() {
    try {
        // 1. Connect to MongoDB using your environment variable or URI
        await mongoose.connect(process.env.MONGO_URI || "mongodb://127.0.0.1:27017/ride");
        console.log("Connected to MongoDB for isolation testing...");

        // 2. Instantiate dummy Ride model
        const testRide = new Ride({
            riderId: new mongoose.Types.ObjectId(), // Valid ObjectId
            vehicleType: "car",

            pickup: {
                address: "MIT ADT University, Pune",
                location: {
                    type: "Point",
                    coordinates: [73.9412, 18.4578] // [longitude, latitude]
                }
            },

            destination: {
                address: "Pune Airport",
                location: {
                    type: "Point",
                    coordinates: [73.9197, 18.5820] // [longitude, latitude]
                }
            },

            status: "requested"
        });

        console.log("\nGenerated Mongoose Object:");
        console.log(testRide.toObject());

        // 3. Test Mongoose Schema Validation without saving to DB
        await testRide.validate();
        console.log("\n✅ Validation Successful! Schema structure is completely valid.");

        /* 
        // Optional: If you want to test saving it directly to MongoDB, uncomment below:
        // const savedRide = await testRide.save();
        // console.log("Saved Ride Document:", savedRide);
        */

    } catch (error) {
        console.error("\n❌ Mongoose Schema Validation Failed:");
        console.error(error.message);
    } finally {
        // 4. Always close the DB connection when finished
        await mongoose.disconnect();
        console.log("Disconnected from MongoDB.");
    }
}

runMongooseTest();