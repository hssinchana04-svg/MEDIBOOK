import express from "express"
import { loginDoctor, doctorProfile, updateDoctorProfile, appointmentsDoctor, appointmentComplete, appointmentCancelDoctor, doctorList, getNearbyDoctors } from "../controllers/doctorController.js"
import authDoctor from "../middlewares/authDoctor.js"

const doctorRouter = express.Router()

function getDistanceKm(lat1, lng1, lat2, lng2) {
  const R = 6371
  const dLat = ((lat2 - lat1) * Math.PI) / 180
  const dLng = ((lng2 - lng1) * Math.PI) / 180
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((lat1 * Math.PI) / 180) *
    Math.cos((lat2 * Math.PI) / 180) *
    Math.sin(dLng / 2) ** 2
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
}

doctorRouter.post("/login", loginDoctor)
doctorRouter.get("/list", doctorList)
doctorRouter.get("/nearby", getNearbyDoctors)
doctorRouter.get("/appointments", authDoctor, appointmentsDoctor)
doctorRouter.get("/profile", authDoctor, doctorProfile)
doctorRouter.post("/update-profile", authDoctor, updateDoctorProfile)
doctorRouter.post("/complete-appointment", authDoctor, appointmentComplete)
doctorRouter.post("/cancel-appointment", authDoctor, appointmentCancelDoctor)

export default doctorRouter