const mongoose = require("mongoose");

const driverSchema = new mongoose.Schema(
{
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
        unique: true
    },

    licenseNumber: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },

    licenseExpiry: {
        type: Date,
        required: true
    },

    status: {
        type: String,
        enum: ["pending", "approved", "rejected", "suspended"],
        default: "pending"
    },

    availabilityStatus: {
        type: String,
        enum: ["offline", "online", "busy"],
        default: "offline"
    },

    isVerified: {
        type: Boolean,
        default: false
    },

    currentLocation: {
        type: {
            type: String,
            enum: ["Point"],
            default: "Point"
        },
        coordinates: {
            type: [Number], // [longitude, latitude]
            default: [0, 0]
        }
    },

    rating: {
        type: Number,
        default: 0,
        min: 0,
        max: 5
    },

    completedTrips: {
        type: Number,
        default: 0
    },
    lastSeen: {
        type: Date
    }

},
{
    timestamps: true
});

driverSchema.index({ currentLocation: "2dsphere" });

driverSchema.index({
    status: 1,
    availabilityStatus: 1
});

module.exports = mongoose.model("Driver", driverSchema);