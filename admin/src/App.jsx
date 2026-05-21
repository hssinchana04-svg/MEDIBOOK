import React, { useContext } from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

// Contexts
import { AdminContext } from './context/AdminContext'
import { DoctorContext } from './context/DoctorContext'

// Components
import Header from './components/Header.jsx'
import Sidebar from './components/Sidebar.jsx'

// Pages
import Login from './pages/Login.jsx'

// Admin Pages
import AdminDashboard from './pages/Admin/Dashboard.jsx'
import AdminAppointments from './pages/Admin/Appointments.jsx'
import AdminAddDoctor from './pages/Admin/AddDoctor.jsx'
import AdminDoctorList from './pages/Admin/DoctorList.jsx'

// Doctor Pages
import DoctorDashboard from './pages/Doctor/Dashboard.jsx'
import DoctorAppointments from './pages/Doctor/Appointments.jsx'
import DoctorProfile from './pages/Doctor/Profile.jsx'

const App = () => {
  const { aToken } = useContext(AdminContext)
  const { dToken } = useContext(DoctorContext)

  // Non-authenticated users will only see the Login screen
  if (!aToken && !dToken) {
    return (
      <>
        <ToastContainer position="top-right" autoClose={3000} />
        <Login />
      </>
    )
  }

  return (
    <div className='app-container'>
      <ToastContainer position="top-right" autoClose={3000} />
      <Header />
      
      <div className='main-layout'>
        <Sidebar />
        
        <main className='content-wrapper'>
          <Routes>
            {/* Admin Routes */}
            {aToken && (
              <>
                <Route path='/' element={<Navigate to='/admin-dashboard' replace />} />
                <Route path='/admin-dashboard' element={<AdminDashboard />} />
                <Route path='/all-appointments' element={<AdminAppointments />} />
                <Route path='/add-doctor' element={<AdminAddDoctor />} />
                <Route path='/doctor-list' element={<AdminDoctorList />} />
                {/* Fallback to dashboard for matching sub-paths */}
                <Route path='*' element={<Navigate to='/admin-dashboard' replace />} />
              </>
            )}

            {/* Doctor Routes */}
            {dToken && (
              <>
                <Route path='/' element={<Navigate to='/doctor-dashboard' replace />} />
                <Route path='/doctor-dashboard' element={<DoctorDashboard />} />
                <Route path='/doctor-appointments' element={<DoctorAppointments />} />
                <Route path='/doctor-profile' element={<DoctorProfile />} />
                {/* Fallback to dashboard for matching sub-paths */}
                <Route path='*' element={<Navigate to='/doctor-dashboard' replace />} />
              </>
            )}
          </Routes>
        </main>
      </div>
    </div>
  )
}

export default App

