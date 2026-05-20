import React from 'react'
import { Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar.jsx'
import Footer from './components/Footer.jsx'
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

const App = () => {
  return (
    <div className='mx-4 sm:mx-[10%]'>
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
        
      </Routes>
      <Footer />
    </div>
  )
}

export default App