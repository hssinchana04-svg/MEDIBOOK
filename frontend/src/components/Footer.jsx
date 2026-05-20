import React from 'react'
import { useNavigate } from 'react-router-dom'

const Footer = () => {
  const navigate = useNavigate()
  return (
    <div className='mt-20 border-t border-gray-200 pt-10 pb-6'>
      <div className='flex flex-col md:flex-row justify-between gap-10'>
        <div className='md:w-1/3'>
          <h1 className='text-2xl font-bold text-blue-600'>Medi<span className='text-gray-800'>book</span></h1>
          <p className='text-gray-500 mt-3 text-sm leading-6'>Your trusted platform to find and book appointments with the best doctors near you.</p>
        </div>
        <div>
          <h3 className='font-semibold mb-3'>COMPANY</h3>
          <ul className='text-gray-500 text-sm space-y-2'>
            <li onClick={() => navigate('/')} className='cursor-pointer hover:text-blue-600'>Home</li>
            <li onClick={() => navigate('/about')} className='cursor-pointer hover:text-blue-600'>About</li>
            <li onClick={() => navigate('/contact')} className='cursor-pointer hover:text-blue-600'>Contact</li>
          </ul>
        </div>
        <div>
          <h3 className='font-semibold mb-3'>GET IN TOUCH</h3>
          <ul className='text-gray-500 text-sm space-y-2'>
            <li>+91 98765 43210</li>
            <li>support@medibook.com</li>
          </ul>
        </div>
      </div>
      <p className='text-center text-gray-400 text-sm mt-10'>© 2024 Medibook. All rights reserved.</p>
    </div>
  )
}

export default Footer