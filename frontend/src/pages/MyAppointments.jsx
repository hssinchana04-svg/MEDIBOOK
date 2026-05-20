import React, { useContext, useEffect, useState } from 'react'
import { AppContext } from '../context/AppContext'
import axios from 'axios'
import { toast } from 'react-toastify'

const MyAppointments = () => {
  const { backendUrl, token } = useContext(AppContext)
  const [appointments, setAppointments] = useState([])

  const getAppointments = async () => {
    try {
      const { data } = await axios.get(`${backendUrl}/api/user/appointments`, { headers: { token } })
      if (data.success) setAppointments(data.appointments.reverse())
      else toast.error(data.message)
    } catch (error) { toast.error(error.message) }
  }

  const cancelAppointment = async (id) => {
    try {
      const { data } = await axios.post(`${backendUrl}/api/user/cancel-appointment`, { appointmentId: id }, { headers: { token } })
      if (data.success) { toast.success("Cancelled!"); getAppointments() }
      else toast.error(data.message)
    } catch (error) { toast.error(error.message) }
  }

  const payNow = async (id) => {
    try {
      const { data } = await axios.post(`${backendUrl}/api/user/payment-razorpay`, { appointmentId: id }, { headers: { token } })
      if (data.success) {
        const options = {
          key: import.meta.env.VITE_RAZORPAY_KEY,
          amount: data.order.amount,
          currency: 'INR',
          name: 'Medibook',
          description: 'Appointment Payment',
          order_id: data.order.id,
          handler: async (response) => {
            const verify = await axios.post(`${backendUrl}/api/user/verify-razorpay`, response, { headers: { token } })
            if (verify.data.success) { toast.success("Payment successful!"); getAppointments() }
          }
        }
        const rzp = new window.Razorpay(options)
        rzp.open()
      }
    } catch (error) { toast.error(error.message) }
  }

  useEffect(() => { if (token) getAppointments() }, [token])

  if (!token) return <div className='text-center py-20 text-gray-400'>Please login to view appointments</div>

  return (
    <div>
      <h2 className='text-2xl font-bold text-gray-800 mb-6'>My Appointments</h2>
      {appointments.length === 0
        ? <div className='text-center py-20 text-gray-400'><div className='text-5xl mb-4'>📅</div><p>No appointments yet</p></div>
        : <div className='space-y-4'>
            {appointments.map((apt) => (
              <div key={apt._id} className='flex flex-col md:flex-row gap-4 border border-gray-200 rounded-xl p-4 hover:shadow-sm'>
                <img src={apt.docData.image} className='w-20 h-20 rounded-xl object-cover bg-blue-50' alt='' />
                <div className='flex-1'>
                  <p className='font-semibold text-gray-800'>{apt.docData.name}</p>
                  <p className='text-gray-500 text-sm'>{apt.docData.speciality}</p>
                  <p className='text-gray-600 text-sm mt-1'>📅 {apt.slotDate} | ⏰ {apt.slotTime}</p>
                  <p className='text-blue-600 font-medium text-sm mt-1'>₹{apt.amount}</p>
                </div>
                <div className='flex flex-col gap-2 justify-center'>
                  {apt.cancelled ? <span className='text-red-500 text-sm font-medium'>Cancelled</span>
                    : apt.isCompleted ? <span className='text-green-500 text-sm font-medium'>Completed</span>
                    : apt.payment ? <span className='text-green-500 text-sm font-medium'>Paid ✅</span>
                    : <><button onClick={() => payNow(apt._id)} className='bg-blue-600 text-white px-4 py-1.5 rounded-full text-sm hover:bg-blue-700'>Pay Now</button><button onClick={() => cancelAppointment(apt._id)} className='border border-red-300 text-red-500 px-4 py-1.5 rounded-full text-sm hover:bg-red-50'>Cancel</button></>
                  }
                </div>
              </div>
            ))}
          </div>
      }
    </div>
  )
}

export default MyAppointments