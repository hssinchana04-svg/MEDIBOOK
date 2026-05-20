import userModel from "../models/userModel.js"
import doctorModel from "../models/doctorModel.js"
import appointmentModel from "../models/appointmentModel.js"
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"
import Razorpay from "razorpay"

const razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET
})

// Register
const registerUser = async (req, res) => {
    try {
        const { name, email, password } = req.body
        if (!name || !email || !password) return res.json({ success: false, message: "All fields required" })

        const exists = await userModel.findOne({ email })
        if (exists) return res.json({ success: false, message: "User already exists" })

        const salt = await bcrypt.genSalt(10)
        const hashedPassword = await bcrypt.hash(password, salt)

        const user = new userModel({ name, email, password: hashedPassword })
        await user.save()

        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "7d" })
        res.json({ success: true, token })
    } catch (error) {
        res.json({ success: false, message: error.message })
    }
}

// Login
const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body
        const user = await userModel.findOne({ email })
        if (!user) return res.json({ success: false, message: "User not found" })

        const isMatch = await bcrypt.compare(password, user.password)
        if (!isMatch) return res.json({ success: false, message: "Invalid credentials" })

        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "7d" })
        res.json({ success: true, token })
    } catch (error) {
        res.json({ success: false, message: error.message })
    }
}

// Get Profile
const getProfile = async (req, res) => {
    try {
        const { userId } = req.body
        const user = await userModel.findById(userId).select("-password")
        res.json({ success: true, userData: user })
    } catch (error) {
        res.json({ success: false, message: error.message })
    }
}

// Update Profile
const updateProfile = async (req, res) => {
    try {
        const { userId, name, phone, address, gender, dob } = req.body
        await userModel.findByIdAndUpdate(userId, { name, phone, address: JSON.parse(address), gender, dob })
        res.json({ success: true, message: "Profile updated" })
    } catch (error) {
        res.json({ success: false, message: error.message })
    }
}

// Book Appointment
const bookAppointment = async (req, res) => {
    try {
        const { userId, docId, slotDate, slotTime } = req.body

        const doctor = await doctorModel.findById(docId).select("-password")
        if (!doctor || !doctor.available) return res.json({ success: false, message: "Doctor not available" })

        let slots_booked = doctor.slots_booked || {}
        if (slots_booked[slotDate] && slots_booked[slotDate].includes(slotTime)) {
            return res.json({ success: false, message: "Slot not available" })
        }

        slots_booked[slotDate] = slots_booked[slotDate] || []
        slots_booked[slotDate].push(slotTime)

        const user = await userModel.findById(userId).select("-password")

        const appointment = new appointmentModel({
            userId, docId, slotDate, slotTime,
            userData: user,
            docData: doctor,
            amount: doctor.fees,
        })

        await appointment.save()
        await doctorModel.findByIdAndUpdate(docId, { slots_booked })
        res.json({ success: true, message: "Appointment booked" })

    } catch (error) {
        res.json({ success: false, message: error.message })
    }
}

// Get User Appointments
const listAppointments = async (req, res) => {
    try {
        const { userId } = req.body
        const appointments = await appointmentModel.find({ userId })
        res.json({ success: true, appointments })
    } catch (error) {
        res.json({ success: false, message: error.message })
    }
}

// Cancel Appointment
const cancelAppointment = async (req, res) => {
    try {
        const { userId, appointmentId } = req.body
        const appointment = await appointmentModel.findById(appointmentId)
        if (appointment.userId !== userId) return res.json({ success: false, message: "Unauthorized" })

        await appointmentModel.findByIdAndUpdate(appointmentId, { cancelled: true })

        // free the slot
        const { docId, slotDate, slotTime } = appointment
        const doctor = await doctorModel.findById(docId)
        let slots_booked = doctor.slots_booked
        slots_booked[slotDate] = slots_booked[slotDate].filter(s => s !== slotTime)
        await doctorModel.findByIdAndUpdate(docId, { slots_booked })

        res.json({ success: true, message: "Appointment cancelled" })
    } catch (error) {
        res.json({ success: false, message: error.message })
    }
}

// Razorpay Payment
const paymentRazorpay = async (req, res) => {
    try {
        const { appointmentId } = req.body
        const appointment = await appointmentModel.findById(appointmentId)
        if (!appointment) return res.json({ success: false, message: "Appointment not found" })

        const options = {
            amount: appointment.amount * 100, // paise
            currency: "INR",
            receipt: appointmentId
        }

        const order = await razorpay.orders.create(options)
        res.json({ success: true, order })
    } catch (error) {
        res.json({ success: false, message: error.message })
    }
}

// Verify Payment
const verifyRazorpay = async (req, res) => {
    try {
        const { razorpay_order_id, razorpay_payment_id } = req.body
        const order = await razorpay.orders.fetch(razorpay_order_id)
        if (order.status === "paid") {
            await appointmentModel.findOneAndUpdate(
                { razorpay_order_id },
                { payment: true, razorpay_payment_id }
            )
            res.json({ success: true, message: "Payment successful" })
        } else {
            res.json({ success: false, message: "Payment failed" })
        }
    } catch (error) {
        res.json({ success: false, message: error.message })
    }
}

export { registerUser, loginUser, getProfile, updateProfile, bookAppointment, listAppointments, cancelAppointment, paymentRazorpay, verifyRazorpay }