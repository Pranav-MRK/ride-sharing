const mongoose = require("mongoose");

const rideSchema = new mongoose.Schema(
{
    riderId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
        index: true
    },

    driverId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Driver",
        default: null,
        index: true
    },

    vehicleType: {
        type: String,
        enum: ["bike", "auto", "car", "suv"],
        required: true
    },

    pickup: {
        address: {
            type: String,
            required: true,
            trim: true
        },

        location: {
            type: {
                type: String,
                enum: ["Point"],
                required: true
            },

            coordinates: {
                type: [Number],
                required: true
            }
        },

        placeId: {
            type: String
        }
    },

    destination: {
        address: {
            type: String,
            required: true,
            trim: true
        },

        location: {
            type: {
                type: String,
                enum: ["Point"],
                required: true
            },

            coordinates: {
                type: [Number],
                required: true
            }
        },

        placeId: {
            type: String
        }
    },

    status: {
        type: String,
        enum: [
            "requested",
            "searching",
            "driver_assigned",
            "driver_arriving",
            "started",
            "completed",
            "cancelled"
        ],
        default: "requested",
        index: true
    },

    distance: {
        type: Number,
        default: null
    },
    arrivingAt: {
        type: Date,
        default: null
    },

    estimatedDuration: {
        type: Number,
        default: null
    },

    estimatedFare: {
        type: Number,
        default: null
    },

    finalFare: {
        type: Number,
        default: null
    },

    acceptedAt: {
        type: Date,
        default: null
    },

    startedAt: {
        type: Date,
        default: null
    },

    completedAt: {
        type: Date,
        default: null
    },

    cancelledAt: {
        type: Date,
        default: null
    },

    cancellationReason: {
        type: String,
        default: null
    }

},
{
    timestamps: true
});

rideSchema.index({
    "pickup.location": "2dsphere"
});

rideSchema.index({
    riderId: 1,
    createdAt: -1
});

rideSchema.index({
    driverId: 1,
    createdAt: -1
});


module.exports = mongoose.model("Ride", rideSchema);