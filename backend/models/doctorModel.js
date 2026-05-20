import mongoose from "mongoose"

const doctorSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    image: { type: String, required: true },
    speciality: { type: String, required: true },
    degree: { type: String, required: true },
    experience: { type: String, required: true },
    about: { type: String, required: true },
    available: { type: Boolean, default: true },
    fees: { type: Number, required: true },
    address: { type: Object, required: true },
    date: { type: Number, required: true },
    slots_booked: { type: Object, default: {} },
    lat: { type: Number },
    lng: { type: Number },

    // location for nearby search
    location: {
        type: { type: String, enum: ["Point"], default: "Point" },
        coordinates: { type: [Number], default: [0, 0] }
    },
    city: { type: String, default: "" },
    clinicAddress: { type: String, default: "" }

}, { minimize: false, timestamps: true })

doctorSchema.index({ location: "2dsphere" })

const doctorModel = mongoose.models.doctor || mongoose.model("doctor", doctorSchema)
export default doctorModel