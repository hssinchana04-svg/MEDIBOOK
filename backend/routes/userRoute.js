import express from "express"
import { registerUser, loginUser, getProfile, updateProfile, bookAppointment, listAppointments, cancelAppointment, paymentRazorpay, verifyRazorpay } from "../controllers/userController.js"
import { symptomCheck, healthChat, scanPrescription } from "../controllers/aiController.js"
import authUser from "../middlewares/authUser.js"
import upload from "../middlewares/multer.js"

const userRouter = express.Router()

userRouter.post("/register", registerUser)
userRouter.post("/login", loginUser)
userRouter.get("/profile", authUser, getProfile)
userRouter.post("/update-profile", authUser, updateProfile)
userRouter.post("/book-appointment", authUser, bookAppointment)
userRouter.get("/appointments", authUser, listAppointments)
userRouter.post("/cancel-appointment", authUser, cancelAppointment)
userRouter.post("/payment-razorpay", authUser, paymentRazorpay)
userRouter.post("/verify-razorpay", authUser, verifyRazorpay)

// AI Features Routes
userRouter.post("/symptom-check", authUser, symptomCheck)
userRouter.post("/health-chat", healthChat)
userRouter.post("/scan-prescription", authUser, upload.single("image"), scanPrescription)

export default userRouter