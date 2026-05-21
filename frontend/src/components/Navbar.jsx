import React, { useContext, useState } from 'react'
import { NavLink, useNavigate } from 'react-router-dom'
import { AppContext } from '../context/AppContext'
import { toast } from 'react-toastify'

const Navbar = () => {
  const navigate = useNavigate()
  const { token, setToken, userData } = useContext(AppContext)
  const [showMenu, setShowMenu] = useState(false)

  const logout = () => {
    setToken("")
    localStorage.removeItem('token')
    toast.success("Logged out successfully")
    navigate('/')
  }

  return (
    <div className='flex items-center justify-between text-sm py-4 mb-5 border-b border-gray-300'>
      <div onClick={() => navigate('/')} className='cursor-pointer'>
        <h1 className='text-2xl font-bold text-blue-600'>Medi<span className='text-gray-800'>book</span></h1>
      </div>

      <ul className='hidden md:flex items-center gap-6 font-medium'>
        <NavLink to='/'><li className='hover:text-blue-600'>HOME</li></NavLink>
        <NavLink to='/doctors'><li className='hover:text-blue-600'>ALL DOCTORS</li></NavLink>
        <NavLink to='/nearby-doctors'><li className='hover:text-blue-600'>NEARBY</li></NavLink>
        <NavLink to='/symptom-checker'><li className='hover:text-blue-600'>SYMPTOM CHECKER</li></NavLink>
        <NavLink to='/prescription-scanner'><li className='hover:text-blue-600'>PRESCRIPTION SCANNER</li></NavLink>
        <NavLink to='/about'><li className='hover:text-blue-600'>ABOUT</li></NavLink>
        <NavLink to='/contact'><li className='hover:text-blue-600'>CONTACT</li></NavLink>
      </ul>

      <div className='flex items-center gap-4'>
        {token && userData ? (
          <div className='relative group cursor-pointer'>
            <div className='flex items-center gap-2'>
              <img src={userData.image || 'https://via.placeholder.com/40'} className='w-8 h-8 rounded-full object-cover' alt='' />
              <span className='text-gray-700 font-medium'>{userData.name}</span>
            </div>
            <div className='absolute right-0 top-8 hidden group-hover:block bg-white shadow-lg rounded-lg p-4 z-50 w-48'>
              <p onClick={() => navigate('/my-profile')} className='hover:text-blue-600 cursor-pointer py-1'>My Profile</p>
              <p onClick={() => navigate('/my-appointments')} className='hover:text-blue-600 cursor-pointer py-1'>My Appointments</p>
              <p onClick={logout} className='hover:text-red-500 cursor-pointer py-1'>Logout</p>
            </div>
          </div>
        ) : (
          <button onClick={() => navigate('/login')} className='bg-blue-600 text-white px-6 py-2 rounded-full font-medium hover:bg-blue-700'>
            Login
          </button>
        )}
      </div>
    </div>
  )
}

export default Navbar