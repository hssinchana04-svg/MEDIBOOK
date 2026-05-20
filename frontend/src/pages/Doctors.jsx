import React, { useContext, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { AppContext } from '../context/AppContext'

const specialities = ['General physician', 'Gynecologist', 'Dermatologist', 'Pediatricians', 'Neurologist', 'Gastroenterologist']

const Doctors = () => {
  const navigate = useNavigate()
  const { speciality } = useParams()
  const { doctors } = useContext(AppContext)
  const [search, setSearch] = useState('')

  const filtered = doctors.filter(doc => {
    const matchSpec = speciality ? doc.speciality === speciality : true
    const matchSearch = doc.name.toLowerCase().includes(search.toLowerCase()) || doc.speciality.toLowerCase().includes(search.toLowerCase())
    return matchSpec && matchSearch
  })

  return (
    <div>
      <h2 className='text-2xl font-bold text-gray-800 mb-2'>All Doctors</h2>
      <p className='text-gray-500 mb-6'>Browse and book from our trusted doctors</p>
      <div className='mb-6'>
        <input value={search} onChange={e => setSearch(e.target.value)} type='text' placeholder='Search by name or speciality...' className='w-full md:w-1/2 border border-gray-300 rounded-full px-5 py-2.5 focus:outline-none focus:border-blue-500' />
      </div>
      <div className='flex flex-col md:flex-row gap-8'>
        <div className='md:w-1/5'>
          <p className='font-semibold text-gray-700 mb-3'>Speciality</p>
          <div className='flex flex-col gap-2'>
            <p onClick={() => navigate('/doctors')} className={`px-4 py-2 rounded-lg cursor-pointer text-sm border transition-all ${!speciality ? 'bg-blue-600 text-white border-blue-600' : 'border-gray-200 hover:border-blue-400'}`}>All</p>
            {specialities.map((spec, i) => (
              <p key={i} onClick={() => navigate(`/doctors/${spec}`)} className={`px-4 py-2 rounded-lg cursor-pointer text-sm border transition-all ${speciality === spec ? 'bg-blue-600 text-white border-blue-600' : 'border-gray-200 hover:border-blue-400'}`}>{spec}</p>
            ))}
          </div>
        </div>
        <div className='flex-1'>
          {filtered.length === 0
            ? <div className='text-center py-20 text-gray-400'><div className='text-5xl mb-4'>😕</div><p>No doctors found</p></div>
            : <div className='grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4'>
                {filtered.map((doc) => (
                  <div key={doc._id} onClick={() => navigate(`/appointment/${doc._id}`)} className='border border-gray-200 rounded-xl overflow-hidden hover:shadow-lg cursor-pointer transition-all hover:-translate-y-1'>
                    <img src={doc.image} alt={doc.name} className='w-full h-40 object-cover bg-blue-50' />
                    <div className='p-3'>
                      <div className='flex items-center gap-1 mb-1'>
                        <span className={`w-2 h-2 rounded-full ${doc.available ? 'bg-green-500' : 'bg-red-400'}`}></span>
                        <span className={`text-xs ${doc.available ? 'text-green-600' : 'text-red-400'}`}>{doc.available ? 'Available' : 'Not Available'}</span>
                      </div>
                      <p className='font-semibold text-gray-800 text-sm'>{doc.name}</p>
                      <p className='text-gray-500 text-xs'>{doc.speciality}</p>
                      <p className='text-blue-600 text-xs font-medium mt-1'>₹{doc.fees}</p>
                    </div>
                  </div>
                ))}
              </div>
          }
        </div>
      </div>
    </div>
  )
}

export default Doctors