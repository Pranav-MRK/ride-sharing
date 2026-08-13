const mongoose = require("mongoose");

const vehicleSchema = new mongoose.Schema(
{
    driverId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Driver",
        required: true,
        unique: true
    },

    vehicleType: {
        type: String,
        enum: ["bike", "auto", "car", "suv"],
        required: true
    },

    brand: {
        type: String,
        required: true,
        trim: true
    },

    model: {
        type: String,
        required: true,
        trim: true
    },

    color: {
        type: String,
        required: true,
        trim: true
    },

    vehicleNumber: {
        type: String,
        required: true,
        unique: true,
        uppercase: true,
        trim: true
    },

    registrationCertificate: {
        type: String,
        required: true
    },

    insuranceNumber: {
        type: String,
        required: true,
        unique: true
    },

    insuranceExpiry: {
        type: Date,
        required: true
    },

    capacity: {
        type: Number,
        default: 4
    },

    isVerified: {
        type: Boolean,
        default: false
    }

},
{
    timestamps: true
});

module.exports = mongoose.model("Vehicle", vehicleSchema);