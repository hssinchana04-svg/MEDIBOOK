import React, { useContext } from 'react'
import { useNavigate } from 'react-router-dom'
import { AppContext } from '../context/AppContext'

const specialities = [
  'General physician', 'Gynecologist', 'Dermatologist',
  'Pediatricians', 'Neurologist', 'Gastroenterologist'
]

const Home = () => {
  const navigate = useNavigate()
  const { doctors } = useContext(AppContext)

  return (
    <div>
      <div className='bg-blue-600 rounded-2xl px-8 md:px-16 py-16 flex flex-col md:flex-row items-center gap-8 mb-16'>
        <div className='md:w-1/2 text-white'>
          <h1 className='text-3xl md:text-5xl font-bold leading-tight mb-4'>Book Appointment With Trusted Doctors</h1>
          <p className='text-blue-100 mb-8 text-lg'>Find experienced doctors near you and book appointments instantly.</p>
          <div className='flex gap-4'>
            <button onClick={() => navigate('/doctors')} className='bg-white text-blue-600 px-8 py-3 rounded-full font-semibold hover:bg-blue-50'>Find Doctors</button>
            <button onClick={() => navigate('/nearby-doctors')} className='border-2 border-white text-white px-8 py-3 rounded-full font-semibold hover:bg-blue-700'>📍 Near Me</button>
          </div>
        </div>
        <div className='md:w-1/2 flex justify-center'>
          <div className='bg-blue-500 rounded-2xl p-8 text-white text-center'>
            <div className='text-6xl mb-4'>🏥</div>
            <p className='text-xl font-semibold'>Your Health Partner</p>
            <p className='text-blue-200 mt-2'>Available 24/7</p>
          </div>
        </div>
      </div>

      <div className='mb-16'>
        <h2 className='text-2xl font-bold text-gray-800 text-center mb-2'>Find by Speciality</h2>
        <p className='text-gray-500 text-center mb-8'>Browse doctors by their area of expertise</p>
        <div className='grid grid-cols-3 md:grid-cols-6 gap-4'>
          {specialities.map((spec, index) => (
            <div key={index} onClick={() => navigate(`/doctors/${spec}`)} className='flex flex-col items-center p-4 border border-gray-200 rounded-xl hover:border-blue-400 hover:bg-blue-50 cursor-pointer transition-all'>
              <div className='text-3xl mb-2'>{index === 0 ? '🩺' : index === 1 ? '👩‍⚕️' : index === 2 ? '🧴' : index === 3 ? '👶' : index === 4 ? '🧠' : '🫁'}</div>
              <p className='text-xs text-center text-gray-600 font-medium'>{spec}</p>
            </div>
          ))}
        </div>
      </div>

      <div className='mb-16'>
        <h2 className='text-2xl font-bold text-gray-800 text-center mb-2'>Top Doctors</h2>
        <p className='text-gray-500 text-center mb-8'>Book appointments with the best doctors</p>
        <div className='grid grid-cols-2 md:grid-cols-4 gap-6'>
          {doctors.slice(0, 8).map((doc) => (
            <div key={doc._id} onClick={() => navigate(`/appointment/${doc._id}`)} className='border border-gray-200 rounded-xl overflow-hidden hover:shadow-lg cursor-pointer transition-all hover:-translate-y-1'>
              <img src={doc.image} alt={doc.name} className='w-full h-40 object-cover bg-blue-50' />
              <div className='p-3'>
                <div className='flex items-center gap-1 mb-1'>
                  <span className={`w-2 h-2 rounded-full ${doc.available ? 'bg-green-500' : 'bg-red-400'}`}></span>
                  <span className={`text-xs ${doc.available ? 'text-green-600' : 'text-red-400'}`}>{doc.available ? 'Available' : 'Not Available'}</span>
                </div>
                <p className='font-semibold text-gray-800 text-sm'>{doc.name}</p>
                <p className='text-gray-500 text-xs'>{doc.speciality}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className='bg-blue-600 rounded-2xl p-10 text-center text-white mb-10'>
        <h2 className='text-2xl md:text-3xl font-bold mb-3'>Book Appointment With 100+ Trusted Doctors</h2>
        <p className='text-blue-100 mb-6'>Find doctors near you, check availability and book instantly</p>
        <button onClick={() => navigate('/login')} className='bg-white text-blue-600 px-8 py-3 rounded-full font-semibold hover:bg-blue-50'>Create Account</button>
      </div>
    </div>
  )
}

export default Home