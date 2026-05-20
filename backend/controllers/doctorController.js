import doctorModel from "../models/doctorModel.js"
import appointmentModel from "../models/appointmentModel.js"
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"

// Doctor Login
const loginDoctor = async (req, res) => {
    try {
        const { email, password } = req.body
        const doctor = await doctorModel.findOne({ email })
        if (!doctor) return res.json({ success: false, message: "Doctor not found" })

        const isMatch = await bcrypt.compare(password, doctor.password)
        if (!isMatch) return res.json({ success: false, message: "Invalid credentials" })

        const token = jwt.sign({ id: doctor._id }, process.env.JWT_SECRET, { expiresIn: "7d" })
        res.json({ success: true, token })
    } catch (error) {
        res.json({ success: false, message: error.message })
    }
}

// Get Doctor Profile
const doctorProfile = async (req, res) => {
    try {
        const { docId } = req.body
        const doctor = await doctorModel.findById(docId).select("-password")
        res.json({ success: true, profileData: doctor })
    } catch (error) {
        res.json({ success: false, message: error.message })
    }
}

// Update Doctor Profile
const updateDoctorProfile = async (req, res) => {
    try {
        const { docId, fees, address, available, about, city, clinicAddress, lat, lng } = req.body
        const updateData = { fees, address, available, about, city, clinicAddress }

        if (lat && lng) {
            updateData.location = {
                type: "Point",
                coordinates: [parseFloat(lng), parseFloat(lat)]
            }
        }

        await doctorModel.findByIdAndUpdate(docId, updateData)
        res.json({ success: true, message: "Profile updated" })
    } catch (error) {
        res.json({ success: false, message: error.message })
    }
}

// Get Doctor Appointments
const appointmentsDoctor = async (req, res) => {
    try {
        const { docId } = req.body
        const appointments = await appointmentModel.find({ docId })
        res.json({ success: true, appointments })
    } catch (error) {
        res.json({ success: false, message: error.message })
    }
}

// Complete Appointment
const appointmentComplete = async (req, res) => {
    try {
        const { docId, appointmentId } = req.body
        const appointment = await appointmentModel.findById(appointmentId)
        if (appointment.docId !== docId) return res.json({ success: false, message: "Unauthorized" })
        await appointmentModel.findByIdAndUpdate(appointmentId, { isCompleted: true })
        res.json({ success: true, message: "Appointment completed" })
    } catch (error) {
        res.json({ success: false, message: error.message })
    }
}

// Cancel Appointment
const appointmentCancelDoctor = async (req, res) => {
    try {
        const { docId, appointmentId } = req.body
        const appointment = await appointmentModel.findById(appointmentId)
        if (appointment.docId !== docId) return res.json({ success: false, message: "Unauthorized" })
        await appointmentModel.findByIdAndUpdate(appointmentId, { cancelled: true })
        res.json({ success: true, message: "Appointment cancelled" })
    } catch (error) {
        res.json({ success: false, message: error.message })
    }
}

// Get All Doctors (public)
const doctorList = async (req, res) => {
    try {
        const doctors = await doctorModel.find({ available: true }).select("-password -slots_booked -email")
        res.json({ success: true, doctors })
    } catch (error) {
        res.json({ success: false, message: error.message })
    }
}

// Nearby Doctors
const getNearbyDoctors = async (req, res) => {
    try {
        const { lat, lng, radius = 10, speciality } = req.query
        if (!lat || !lng) return res.json({ success: false, message: "Location required" })

        const query = {
            available: true,
            location: {
                $near: {
                    $geometry: { type: "Point", coordinates: [parseFloat(lng), parseFloat(lat)] },
                    $maxDistance: parseFloat(radius) * 1000
                }
            }
        }
        if (speciality && speciality !== "All") query.speciality = speciality

        const doctors = await doctorModel.find(query).select("-password -slots_booked -email")
        res.json({ success: true, doctors })
    } catch (error) {
        res.json({ success: false, message: error.message })
    }
}

export { loginDoctor, doctorProfile, updateDoctorProfile, appointmentsDoctor, appointmentComplete, appointmentCancelDoctor, doctorList, getNearbyDoctors }