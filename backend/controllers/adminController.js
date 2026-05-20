import jwt from "jsonwebtoken"
import bcrypt from "bcrypt"
import doctorModel from "../models/doctorModel.js"
import appointmentModel from "../models/appointmentModel.js"
import { v2 as cloudinary } from "cloudinary"

// Admin Login
const loginAdmin = async (req, res) => {
    try {
        const { email, password } = req.body
        if (email !== process.env.ADMIN_EMAIL || password !== process.env.ADMIN_PASSWORD) {
            return res.json({ success: false, message: "Invalid credentials" })
        }
        const token = jwt.sign({ email }, process.env.JWT_SECRET, { expiresIn: "7d" })
        res.json({ success: true, token })
    } catch (error) {
        res.json({ success: false, message: error.message })
    }
}

// Add Doctor
const addDoctor = async (req, res) => {
    try {
        const { name, email, password, speciality, degree, experience, about, fees, address, city, clinicAddress, lat, lng } = req.body
        const imageFile = req.file

        if (!name || !email || !password || !speciality || !degree || !experience || !about || !fees || !address) {
            return res.json({ success: false, message: "All fields required" })
        }

        const salt = await bcrypt.genSalt(10)
        const hashedPassword = await bcrypt.hash(password, salt)

        const imageUpload = await cloudinary.uploader.upload(imageFile.path, { resource_type: "image" })

        const doctorData = {
            name, email,
            password: hashedPassword,
            image: imageUpload.secure_url,
            speciality, degree, experience, about,
            fees: Number(fees),
            address: JSON.parse(address),
            city: city || "",
            clinicAddress: clinicAddress || "",
            location: {
                type: "Point",
                coordinates: [parseFloat(lng) || 0, parseFloat(lat) || 0]
            },
            date: Date.now()
        }

        const newDoctor = new doctorModel(doctorData)
        await newDoctor.save()
        res.json({ success: true, message: "Doctor added successfully" })

    } catch (error) {
        res.json({ success: false, message: error.message })
    }
}

// Get All Doctors
const allDoctors = async (req, res) => {
    try {
        const doctors = await doctorModel.find({}).select("-password")
        res.json({ success: true, doctors })
    } catch (error) {
        res.json({ success: false, message: error.message })
    }
}

// Get All Appointments
const appointmentsAdmin = async (req, res) => {
    try {
        const appointments = await appointmentModel.find({})
        res.json({ success: true, appointments })
    } catch (error) {
        res.json({ success: false, message: error.message })
    }
}

// Cancel Appointment
const appointmentCancel = async (req, res) => {
    try {
        const { appointmentId } = req.body
        await appointmentModel.findByIdAndUpdate(appointmentId, { cancelled: true })
        res.json({ success: true, message: "Appointment cancelled" })
    } catch (error) {
        res.json({ success: false, message: error.message })
    }
}

// Dashboard Stats
const adminDashboard = async (req, res) => {
    try {
        const doctors = await doctorModel.find({})
        const appointments = await appointmentModel.find({})
        const users = await (await import("../models/userModel.js")).default.find({})

        const dashData = {
            doctors: doctors.length,
            appointments: appointments.length,
            patients: users.length,
            latestAppointments: appointments.reverse().slice(0, 5)
        }
        res.json({ success: true, dashData })
    } catch (error) {
        res.json({ success: false, message: error.message })
    }
}

export { loginAdmin, addDoctor, allDoctors, appointmentsAdmin, appointmentCancel, adminDashboard }