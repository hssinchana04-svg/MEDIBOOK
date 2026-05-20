import mongoose from "mongoose"
import bcrypt from "bcrypt"
import "dotenv/config"
import doctorModel from "./models/doctorModel.js"

const connectDB = async () => {
    await mongoose.connect(process.env.MONGODB_URI)
    console.log("MongoDB Connected")
}

const BASE = "https://res.cloudinary.com/dpevzl3qm/image/upload"

const doctors = [
    {
        name: "Dr. Sarah Johnson",
        email: "sarah.johnson@medibook.com",
        password: "doctor123",
        image: `${BASE}/v1774796960/mjjlgtbivehjsyri87r2.png`,
        speciality: "General physician",
        degree: "MBBS, MD",
        experience: "5 Years",
        about: "Dr. Sarah Johnson is a dedicated general physician with 5 years of experience in diagnosing and treating a wide range of illnesses.",
        available: true, fees: 500,
        address: { line1: "17th Cross, Richmond Circle", line2: "Bangalore, Karnataka" },
        city: "Bangalore", clinicAddress: "17th Cross, Richmond Circle, Bangalore",
        location: { type: "Point", coordinates: [77.5946, 12.9716] },
        lat: 12.9716, lng: 77.5946, date: Date.now(), slots_booked: {},
    },
    {
        name: "Dr. Rahul Sharma",
        email: "rahul.sharma@medibook.com",
        password: "doctor123",
        image: `${BASE}/v1774796960/slkwidtqxh5w1bgrzb5n.png`,
        speciality: "Neurologist",
        degree: "MBBS, MD, DM Neurology",
        experience: "8 Years",
        about: "Dr. Rahul Sharma is a highly skilled neurologist specializing in brain and nervous system disorders with 8 years of experience.",
        available: true, fees: 1200,
        address: { line1: "MG Road, Shivaji Nagar", line2: "Pune, Maharashtra" },
        city: "Pune", clinicAddress: "MG Road, Shivaji Nagar, Pune",
        location: { type: "Point", coordinates: [73.8567, 18.5204] },
        lat: 18.5204, lng: 73.8567, date: Date.now(), slots_booked: {},
    },
    {
        name: "Dr. Priya Patel",
        email: "priya.patel@medibook.com",
        password: "doctor123",
        image: `${BASE}/v1774796960/i6yapjwjug8od46zcl4z.png`,
        speciality: "Gynecologist",
        degree: "MBBS, MS Obstetrics",
        experience: "10 Years",
        about: "Dr. Priya Patel is an experienced gynecologist providing comprehensive womens health care with 10 years of practice.",
        available: true, fees: 800,
        address: { line1: "Banjara Hills, Road No 12", line2: "Hyderabad, Telangana" },
        city: "Hyderabad", clinicAddress: "Banjara Hills Road No 12, Hyderabad",
        location: { type: "Point", coordinates: [78.4867, 17.3850] },
        lat: 17.3850, lng: 78.4867, date: Date.now(), slots_booked: {},
    },
    {
        name: "Dr. Amit Verma",
        email: "amit.verma@medibook.com",
        password: "doctor123",
        image: `${BASE}/v1774796960/nlb1ngqe7sebjhxnka91.png`,
        speciality: "Dermatologist",
        degree: "MBBS, MD Dermatology",
        experience: "6 Years",
        about: "Dr. Amit Verma is a skilled dermatologist treating skin, hair and nail conditions with modern techniques.",
        available: true, fees: 700,
        address: { line1: "Anna Nagar, 2nd Street", line2: "Chennai, Tamil Nadu" },
        city: "Chennai", clinicAddress: "Anna Nagar 2nd Street, Chennai",
        location: { type: "Point", coordinates: [80.2707, 13.0827] },
        lat: 13.0827, lng: 80.2707, date: Date.now(), slots_booked: {},
    },
    {
        name: "Dr. Sneha Reddy",
        email: "sneha.reddy@medibook.com",
        password: "doctor123",
        image: `${BASE}/v1774796960/weivoalktu0l8xxruff6.png`,
        speciality: "Pediatricians",
        degree: "MBBS, MD Pediatrics",
        experience: "7 Years",
        about: "Dr. Sneha Reddy is a caring pediatrician dedicated to the health and wellbeing of children from birth to adolescence.",
        available: true, fees: 600,
        address: { line1: "Koramangala, 5th Block", line2: "Bangalore, Karnataka" },
        city: "Bangalore", clinicAddress: "Koramangala 5th Block, Bangalore",
        location: { type: "Point", coordinates: [77.6245, 12.9352] },
        lat: 12.9352, lng: 77.6245, date: Date.now(), slots_booked: {},
    },
    {
        name: "Dr. Vikram Singh",
        email: "vikram.singh@medibook.com",
        password: "doctor123",
        image: `${BASE}/v1774796960/ilil4mngf1zhynnunr3y.png`,
        speciality: "Gastroenterologist",
        degree: "MBBS, MD, DM Gastroenterology",
        experience: "12 Years",
        about: "Dr. Vikram Singh is a renowned gastroenterologist with expertise in digestive system disorders and liver diseases.",
        available: true, fees: 1500,
        address: { line1: "Sector 18, Noida", line2: "Uttar Pradesh" },
        city: "Noida", clinicAddress: "Sector 18 Noida, Uttar Pradesh",
        location: { type: "Point", coordinates: [77.3910, 28.5355] },
        lat: 28.5355, lng: 77.3910, date: Date.now(), slots_booked: {},
    },
    {
        name: "Dr. Ananya Das",
        email: "ananya.das@medibook.com",
        password: "doctor123",
        image: `${BASE}/v1774796960/pxvblznzzfzqqv6vtnft.png`,
        speciality: "General physician",
        degree: "MBBS, DNB",
        experience: "4 Years",
        about: "Dr. Ananya Das provides comprehensive primary care services with a patient-first approach.",
        available: true, fees: 400,
        address: { line1: "Salt Lake, Sector 5", line2: "Kolkata, West Bengal" },
        city: "Kolkata", clinicAddress: "Salt Lake Sector 5, Kolkata",
        location: { type: "Point", coordinates: [88.3639, 22.5726] },
        lat: 22.5726, lng: 88.3639, date: Date.now(), slots_booked: {},
    },
    {
        name: "Dr. Rajan Mehta",
        email: "rajan.mehta@medibook.com",
        password: "doctor123",
        image: `${BASE}/v1774796960/vh46qgfovnsmzowolyir.png`,
        speciality: "Neurologist",
        degree: "MBBS, MD Neurology",
        experience: "9 Years",
        about: "Dr. Rajan Mehta specializes in treatment of migraines, epilepsy and other neurological conditions.",
        available: true, fees: 1100,
        address: { line1: "Indiranagar, 100 Feet Road", line2: "Bangalore, Karnataka" },
        city: "Bangalore", clinicAddress: "Indiranagar 100 Feet Road, Bangalore",
        location: { type: "Point", coordinates: [77.6408, 12.9784] },
        lat: 12.9784, lng: 77.6408, date: Date.now(), slots_booked: {},
    },
    {
        name: "Dr. Kavita Nair",
        email: "kavita.nair@medibook.com",
        password: "doctor123",
        image: `${BASE}/v1774796960/sab4wzjijyfs3va9jjvm.png`,
        speciality: "Dermatologist",
        degree: "MBBS, DVD",
        experience: "5 Years",
        about: "Dr. Kavita Nair is an expert dermatologist specializing in cosmetic and medical dermatology.",
        available: true, fees: 750,
        address: { line1: "Viman Nagar, Pune", line2: "Maharashtra" },
        city: "Pune", clinicAddress: "Viman Nagar, Pune",
        location: { type: "Point", coordinates: [73.9197, 18.5679] },
        lat: 18.5679, lng: 73.9197, date: Date.now(), slots_booked: {},
    },
    {
        name: "Dr. Suresh Kumar",
        email: "suresh.kumar@medibook.com",
        password: "doctor123",
        image: `${BASE}/v1774796960/upqy3lgzk8tvyw2cyezb.png`,
        speciality: "Pediatricians",
        degree: "MBBS, DCH, MD",
        experience: "15 Years",
        about: "Dr. Suresh Kumar is a senior pediatrician with 15 years of experience in child healthcare and development.",
        available: true, fees: 900,
        address: { line1: "T Nagar, Pondy Bazaar", line2: "Chennai, Tamil Nadu" },
        city: "Chennai", clinicAddress: "T Nagar Pondy Bazaar, Chennai",
        location: { type: "Point", coordinates: [80.2337, 13.0418] },
        lat: 13.0418, lng: 80.2337, date: Date.now(), slots_booked: {},
    },
    {
        name: "Dr. Meera Iyer",
        email: "meera.iyer@medibook.com",
        password: "doctor123",
        image: `${BASE}/v1774796960/wlcxslritqy44qxe95tr.png`,
        speciality: "Gynecologist",
        degree: "MBBS, MS",
        experience: "6 Years",
        about: "Dr. Meera Iyer is a compassionate gynecologist committed to women's health and wellness.",
        available: true, fees: 850,
        address: { line1: "Jayanagar, 4th Block", line2: "Bangalore, Karnataka" },
        city: "Bangalore", clinicAddress: "Jayanagar 4th Block, Bangalore",
        location: { type: "Point", coordinates: [77.5832, 12.9250] },
        lat: 12.9250, lng: 77.5832, date: Date.now(), slots_booked: {},
    },
    {
        name: "Dr. Arjun Nair",
        email: "arjun.nair@medibook.com",
        password: "doctor123",
        image: `${BASE}/v1774796960/zustetx8har2wtdidjrg.png`,
        speciality: "General physician",
        degree: "MBBS, MD",
        experience: "3 Years",
        about: "Dr. Arjun Nair is a passionate general physician focused on preventive care and patient education.",
        available: true, fees: 450,
        address: { line1: "Whitefield, ITPL Road", line2: "Bangalore, Karnataka" },
        city: "Bangalore", clinicAddress: "Whitefield ITPL Road, Bangalore",
        location: { type: "Point", coordinates: [77.7480, 12.9698] },
        lat: 12.9698, lng: 77.7480, date: Date.now(), slots_booked: {},
    },
    {
        name: "Dr. Pooja Sharma",
        email: "pooja.sharma@medibook.com",
        password: "doctor123",
        image: `${BASE}/v1774796960/xq5tatlfqhyccfqzgvgo.png`,
        speciality: "Gastroenterologist",
        degree: "MBBS, MD, DM",
        experience: "8 Years",
        about: "Dr. Pooja Sharma is an experienced gastroenterologist specializing in digestive health and liver conditions.",
        available: true, fees: 1300,
        address: { line1: "Himayatnagar", line2: "Hyderabad, Telangana" },
        city: "Hyderabad", clinicAddress: "Himayatnagar, Hyderabad",
        location: { type: "Point", coordinates: [78.4772, 17.3987] },
        lat: 17.3987, lng: 78.4772, date: Date.now(), slots_booked: {},
    },
    {
        name: "Dr. Deepak Menon",
        email: "deepak.menon@medibook.com",
        password: "doctor123",
        image: `${BASE}/v1774796960/vkf3oncjdn7qzaenaxat.png`,
        speciality: "Neurologist",
        degree: "MBBS, DM Neurology",
        experience: "11 Years",
        about: "Dr. Deepak Menon is a senior neurologist with expertise in stroke management and neurological rehabilitation.",
        available: true, fees: 1400,
        address: { line1: "Jubilee Hills, Road No 36", line2: "Hyderabad, Telangana" },
        city: "Hyderabad", clinicAddress: "Jubilee Hills Road No 36, Hyderabad",
        location: { type: "Point", coordinates: [78.4081, 17.4317] },
        lat: 17.4317, lng: 78.4081, date: Date.now(), slots_booked: {},
    },
    {
        name: "Dr. Lakshmi Prasad",
        email: "lakshmi.prasad@medibook.com",
        password: "doctor123",
        image: `${BASE}/v1774796960/tsoyyta28mpimzjt7d1m.png`,
        speciality: "Pediatricians",
        degree: "MBBS, MD Pediatrics, Fellowship",
        experience: "13 Years",
        about: "Dr. Lakshmi Prasad is a highly experienced pediatrician known for her gentle approach with children and thorough care.",
        available: true, fees: 950,
        address: { line1: "Malleswaram, 8th Cross", line2: "Bangalore, Karnataka" },
        city: "Bangalore", clinicAddress: "Malleswaram 8th Cross, Bangalore",
        location: { type: "Point", coordinates: [77.5640, 13.0035] },
        lat: 13.0035, lng: 77.5640, date: Date.now(), slots_booked: {},
    },
]

const seedDoctors = async () => {
    try {
        await connectDB()
        await doctorModel.deleteMany({})
        console.log("Cleared existing doctors")

        const hashedDoctors = await Promise.all(
            doctors.map(async (doc) => {
                const salt = await bcrypt.genSalt(10)
                const hashedPassword = await bcrypt.hash(doc.password, salt)
                return { ...doc, password: hashedPassword }
            })
        )

        await doctorModel.insertMany(hashedDoctors)
        console.log("✅ 15 Doctors seeded successfully with Cloudinary images!")
        process.exit(0)

    } catch (error) {
        console.log("Error:", error.message)
        process.exit(1)
    }
}

seedDoctors()