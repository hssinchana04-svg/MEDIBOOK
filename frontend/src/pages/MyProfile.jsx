import React, { useContext, useState } from 'react'
import { AppContext } from '../context/AppContext'
import axios from 'axios'
import { toast } from 'react-toastify'

const MyProfile = () => {
  const { userData, setUserData, backendUrl, token } = useContext(AppContext)
  const [isEdit, setIsEdit] = useState(false)
  const [name, setName] = useState(userData?.name || '')
  const [phone, setPhone] = useState(userData?.phone || '')
  const [gender, setGender] = useState(userData?.gender || '')
  const [dob, setDob] = useState(userData?.dob || '')

  const updateProfile = async () => {
    try {
      const { data } = await axios.post(`${backendUrl}/api/user/update-profile`,
        { name, phone, gender, dob, address: JSON.stringify(userData.address || {}) },
        { headers: { token } }
      )
      if (data.success) { toast.success("Profile updated!"); setIsEdit(false); setUserData(prev => ({ ...prev, name, phone, gender, dob })) }
      else toast.error(data.message)
    } catch (error) { toast.error(error.message) }
  }

  if (!userData) return <div className='text-center py-20 text-gray-400'>Please login to view profile</div>

  return (
    <div className='max-w-xl mx-auto py-10'>
      <div className='bg-white border border-gray-200 rounded-2xl p-8 shadow-sm'>
        <div className='flex items-center gap-6 mb-8'>
          <img src={userData.image || 'https://via.placeholder.com/80'} className='w-20 h-20 rounded-full object-cover border-4 border-blue-100' alt='' />
          <div>
            {isEdit
              ? <input value={name} onChange={e => setName(e.target.value)} className='border border-gray-300 rounded-lg px-3 py-1.5 text-lg font-semibold focus:outline-none focus:border-blue-500' />
              : <h2 className='text-xl font-bold text-gray-800'>{userData.name}</h2>
            }
            <p className='text-gray-500 text-sm'>{userData.email}</p>
          </div>
        </div>
        <div className='space-y-4'>
          <div>
            <label className='text-xs text-gray-500 uppercase font-medium'>Phone</label>
            {isEdit ? <input value={phone} onChange={e => setPhone(e.target.value)} className='w-full border border-gray-300 rounded-lg px-3 py-2 mt-1 focus:outline-none focus:border-blue-500' /> : <p className='text-gray-700 mt-1'>{userData.phone || 'Not set'}</p>}
          </div>
          <div>
            <label className='text-xs text-gray-500 uppercase font-medium'>Gender</label>
            {isEdit ? <select value={gender} onChange={e => setGender(e.target.value)} className='w-full border border-gray-300 rounded-lg px-3 py-2 mt-1 focus:outline-none focus:border-blue-500'><option value=''>Select</option><option value='Male'>Male</option><option value='Female'>Female</option></select> : <p className='text-gray-700 mt-1'>{userData.gender || 'Not set'}</p>}
          </div>
          <div>
            <label className='text-xs text-gray-500 uppercase font-medium'>Date of Birth</label>
            {isEdit ? <input type='date' value={dob} onChange={e => setDob(e.target.value)} className='w-full border border-gray-300 rounded-lg px-3 py-2 mt-1 focus:outline-none focus:border-blue-500' /> : <p className='text-gray-700 mt-1'>{userData.dob || 'Not set'}</p>}
          </div>
        </div>
        <div className='mt-8 flex gap-3'>
          {isEdit
            ? <><button onClick={updateProfile} className='bg-blue-600 text-white px-6 py-2 rounded-full hover:bg-blue-700'>Save</button><button onClick={() => setIsEdit(false)} className='border border-gray-300 px-6 py-2 rounded-full hover:bg-gray-50'>Cancel</button></>
            : <button onClick={() => setIsEdit(true)} className='bg-blue-50 text-blue-600 px-6 py-2 rounded-full hover:bg-blue-100'>Edit Profile</button>
          }
        </div>
      </div>
    </div>
  )
}

export default MyProfile