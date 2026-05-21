import React from 'react'
import { Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar.jsx'
import Footer from './components/Footer.jsx'
import Chatbot from './components/Chatbot.jsx'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import Home from './pages/Home.jsx'
import Doctors from './pages/Doctors.jsx'
import About from './pages/About.jsx'
import Contact from './pages/Contact.jsx'
import Login from './pages/Login.jsx'
import MyProfile from './pages/MyProfile.jsx'
import MyAppointments from './pages/MyAppointments.jsx'
import Appointment from './pages/Appointment.jsx'
import NearbyDoctors from './pages/NearbyDoctors.jsx'
import SymptomChecker from './pages/SymptomChecker.jsx'
import PrescriptionScanner from './pages/PrescriptionScanner.jsx'

const App = () => {
  return (
    <div className='mx-4 sm:mx-[10%] relative min-h-screen pb-16'>
      <ToastContainer />
      <Navbar />
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/login' element={<Login />} />
        <Route path='/doctors' element={<Doctors />} />
        <Route path='/doctors/:speciality' element={<Doctors />} />
        <Route path='/about' element={<About />} />
        <Route path='/contact' element={<Contact />} />
        <Route path='/my-profile' element={<MyProfile />} />
        <Route path='/my-appointments' element={<MyAppointments />} />
        <Route path='/appointment/:docId' element={<Appointment />} />
        <Route path='/nearby-doctors' element={<NearbyDoctors />} />
        <Route path='/symptom-checker' element={<SymptomChecker />} />
        <Route path='/prescription-scanner' element={<PrescriptionScanner />} />
      </Routes>
      <Chatbot />
      <Footer />
    </div>
  )
}

export default App