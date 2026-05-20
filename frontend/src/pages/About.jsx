import React from 'react'
import { useNavigate } from 'react-router-dom'

const About = () => {
  const navigate = useNavigate()
  return (
    <div>
      <h2 className='text-2xl font-bold text-gray-800 mb-8 text-center'>About Medibook</h2>
      <div className='flex flex-col md:flex-row gap-10 mb-16'>
        <div className='md:w-1/2 bg-blue-50 rounded-2xl flex items-center justify-center h-64'>
          <div className='text-center'><div className='text-7xl mb-4'>🏥</div><p className='text-blue-600 font-semibold'>Your Health Partner</p></div>
        </div>
        <div className='md:w-1/2'>
          <h3 className='text-xl font-bold text-gray-800 mb-4'>Who We Are</h3>
          <p className='text-gray-500 leading-7 mb-4'>Medibook is a modern healthcare platform connecting patients with trusted doctors. We make it easy to find specialists, check availability, and book appointments.</p>
          <p className='text-gray-500 leading-7'>Our platform supports 3 portals — for patients, doctors, and admins — ensuring a seamless experience for everyone.</p>
        </div>
      </div>
      <div className='grid grid-cols-1 md:grid-cols-3 gap-6 mb-16'>
        {[
          { icon: '👨‍⚕️', title: 'Expert Doctors', desc: 'All doctors are verified and experienced professionals' },
          { icon: '📍', title: 'Find Nearby', desc: 'Locate doctors near you using GPS location search' },
          { icon: '💳', title: 'Easy Payments', desc: 'Secure online payments with Razorpay integration' },
        ].map((item, i) => (
          <div key={i} className='border border-gray-200 rounded-xl p-6 text-center hover:shadow-md transition-all'>
            <div className='text-4xl mb-3'>{item.icon}</div>
            <h4 className='font-semibold text-gray-800 mb-2'>{item.title}</h4>
            <p className='text-gray-500 text-sm'>{item.desc}</p>
          </div>
        ))}
      </div>
      <div className='bg-blue-600 rounded-2xl p-10 text-center text-white'>
        <h3 className='text-2xl font-bold mb-3'>Ready to Get Started?</h3>
        <p className='text-blue-100 mb-6'>Book your appointment today with trusted doctors near you</p>
        <button onClick={() => navigate('/doctors')} className='bg-white text-blue-600 px-8 py-3 rounded-full font-semibold hover:bg-blue-50'>Find a Doctor</button>
      </div>
    </div>
  )
}

export default About