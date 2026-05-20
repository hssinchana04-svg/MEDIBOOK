import React, { useContext, useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { AppContext } from '../context/AppContext'
import axios from 'axios'
import { toast } from 'react-toastify'

const daysOfWeek = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT']

const Appointment = () => {
  const { docId } = useParams()
  const navigate = useNavigate()
  const { doctors, backendUrl, token, userData } = useContext(AppContext)
  const [doctor, setDoctor] = useState(null)
  const [slots, setSlots] = useState([])
  const [selectedDay, setSelectedDay] = useState(0)
  const [selectedTime, setSelectedTime] = useState('')
  const [patientName, setPatientName] = useState('')
  const [patientAge, setPatientAge] = useState('')

  useEffect(() => {
    if (userData) setPatientName(userData.name || '')
  }, [userData])

  useEffect(() => {
    const doc = doctors.find(d => d._id === docId)
    if (doc) setDoctor(doc)
  }, [doctors, docId])

  useEffect(() => {
    if (!doctor) return
    const allSlots = []
    const today = new Date()
    for (let i = 0; i < 7; i++) {
      const date = new Date(today)
      date.setDate(today.getDate() + i)
      const times = []
      let start = new Date(date)
      start.setHours(10, 0, 0, 0)
      const end = new Date(date)
      end.setHours(21, 0, 0, 0)
      while (start < end) {
        const slotDate = `${date.getDate()}_${date.getMonth() + 1}_${date.getFullYear()}`
        const slotTime = start.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        const isBooked = doctor.slots_booked?.[slotDate]?.includes(slotTime)
        if (!isBooked && start > new Date()) times.push({ time: slotTime, date: slotDate })
        start.setMinutes(start.getMinutes() + 30)
      }
      allSlots.push({ date, times })
    }
    setSlots(allSlots)
  }, [doctor])

  const bookAppointment = async () => {
    if (!token) { toast.error("Please login first"); return navigate('/login') }
    if (!selectedTime) { toast.error("Please select a time slot"); return }
    if (!patientName || !patientAge) { toast.error("Please enter patient details"); return }
    try {
      const slotDate = slots[selectedDay]?.times.find(s => s.time === selectedTime)?.date
      const { data } = await axios.post(`${backendUrl}/api/user/book-appointment`, { docId, slotDate, slotTime: selectedTime, patientDetails: { name: patientName, age: patientAge } }, { headers: { token } })
      if (data.success) { toast.success("Appointment booked!"); navigate('/my-appointments') }
      else toast.error(data.message)
    } catch (error) { toast.error(error.message) }
  }

  if (!doctor) return <div className='text-center py-20 text-gray-400'>Loading...</div>

  return (
    <div>
      <div className='flex flex-col md:flex-row gap-6 mb-8'>
        <img src={doctor.image} className='w-full md:w-64 h-64 object-cover rounded-2xl bg-blue-50' alt='' />
        <div className='border border-gray-200 rounded-2xl p-6 flex-1'>
          <h2 className='text-2xl font-bold text-gray-800'>{doctor.name}</h2>
          <p className='text-gray-500 mt-1'>{doctor.degree} — {doctor.speciality}</p>
          <p className='text-gray-500 text-sm mt-1'>{doctor.experience} experience</p>
          <div className='mt-4'><p className='font-semibold text-gray-700 mb-1'>About</p><p className='text-gray-500 text-sm leading-6'>{doctor.about}</p></div>
          <p className='mt-4 font-semibold text-gray-800'>Consultation Fee: <span className='text-blue-600'>₹{doctor.fees}</span></p>
        </div>
      </div>
      <div className='border border-gray-200 rounded-2xl p-6 mb-6'>
        <h3 className='font-semibold text-gray-800 mb-4'>Select Appointment Slot</h3>
        <div className='flex gap-3 overflow-x-auto pb-2 mb-4'>
          {slots.map((slot, i) => (
            <div key={i} onClick={() => { setSelectedDay(i); setSelectedTime('') }} className={`flex flex-col items-center px-4 py-3 rounded-xl cursor-pointer border min-w-[60px] transition-all ${selectedDay === i ? 'bg-blue-600 text-white border-blue-600' : 'border-gray-200 hover:border-blue-400'}`}>
              <p className='text-xs'>{daysOfWeek[slot.date.getDay()]}</p>
              <p className='text-lg font-bold'>{slot.date.getDate()}</p>
            </div>
          ))}
        </div>
        <div className='flex flex-wrap gap-2'>
          {slots[selectedDay]?.times.map((slot, i) => (
            <button key={i} onClick={() => setSelectedTime(slot.time)} className={`px-4 py-2 rounded-full text-sm border transition-all ${selectedTime === slot.time ? 'bg-blue-600 text-white border-blue-600' : 'border-gray-200 hover:border-blue-400'}`}>{slot.time}</button>
          ))}
        </div>
      </div>
      {selectedTime && (
        <div className='border border-gray-200 rounded-2xl p-6 mb-6'>
          <h3 className='font-semibold text-gray-800 mb-4'>Patient Details</h3>
          <div className='flex flex-col gap-4 max-w-sm'>
            <input type='text' value={patientName} onChange={e => setPatientName(e.target.value)} placeholder='Patient Name' className='border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:border-blue-500' required />
            <input type='number' value={patientAge} onChange={e => setPatientAge(e.target.value)} placeholder='Patient Age' className='border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:border-blue-500' required />
          </div>
        </div>
      )}
      <button onClick={bookAppointment} className='bg-blue-600 text-white px-10 py-3 rounded-full font-semibold hover:bg-blue-700'>Book Appointment</button>
    </div>
  )
}

export default Appointment