import React, { useContext, useState, useEffect } from 'react'
import { AppContext } from '../context/AppContext'
import axios from 'axios'
import { toast } from 'react-toastify'
import { useNavigate } from 'react-router-dom'

const Login = () => {
  const { backendUrl, token, setToken } = useContext(AppContext)
  const navigate = useNavigate()
  const [state, setState] = useState('Login')
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const onSubmitHandler = async (e) => {
    e.preventDefault()
    try {
      if (state === 'Sign Up') {
        const { data } = await axios.post(`${backendUrl}/api/user/register`, { name, email, password })
        if (data.success) { localStorage.setItem('token', data.token); setToken(data.token); toast.success("Account created!") }
        else toast.error(data.message)
      } else {
        const { data } = await axios.post(`${backendUrl}/api/user/login`, { email, password })
        if (data.success) { localStorage.setItem('token', data.token); setToken(data.token); toast.success("Logged in!") }
        else toast.error(data.message)
      }
    } catch (error) { toast.error(error.message) }
  }

  useEffect(() => { if (token) navigate('/') }, [token])

  return (
    <div className='min-h-[80vh] flex items-center justify-center'>
      <form onSubmit={onSubmitHandler} className='bg-white shadow-lg rounded-xl p-8 w-full max-w-md border border-gray-100'>
        <h2 className='text-2xl font-bold text-gray-800 mb-1'>{state === 'Login' ? 'Welcome Back' : 'Create Account'}</h2>
        <p className='text-gray-500 text-sm mb-6'>{state === 'Login' ? 'Login to book appointments' : 'Sign up to get started'}</p>
        {state === 'Sign Up' && (
          <div className='mb-4'>
            <label className='text-sm text-gray-600'>Full Name</label>
            <input value={name} onChange={e => setName(e.target.value)} className='w-full border border-gray-300 rounded-lg px-4 py-2 mt-1 focus:outline-none focus:border-blue-500' type='text' placeholder='John Doe' required />
          </div>
        )}
        <div className='mb-4'>
          <label className='text-sm text-gray-600'>Email</label>
          <input value={email} onChange={e => setEmail(e.target.value)} className='w-full border border-gray-300 rounded-lg px-4 py-2 mt-1 focus:outline-none focus:border-blue-500' type='email' placeholder='you@email.com' required />
        </div>
        <div className='mb-6'>
          <label className='text-sm text-gray-600'>Password</label>
          <input value={password} onChange={e => setPassword(e.target.value)} className='w-full border border-gray-300 rounded-lg px-4 py-2 mt-1 focus:outline-none focus:border-blue-500' type='password' placeholder='••••••••' required />
        </div>
        <button className='w-full bg-blue-600 text-white py-2.5 rounded-lg font-medium hover:bg-blue-700'>{state === 'Login' ? 'Login' : 'Create Account'}</button>
        {state === 'Login'
          ? <p className='text-center text-sm text-gray-500 mt-4'>Don't have an account? <span onClick={() => setState('Sign Up')} className='text-blue-600 cursor-pointer font-medium'>Sign Up</span></p>
          : <p className='text-center text-sm text-gray-500 mt-4'>Already have an account? <span onClick={() => setState('Login')} className='text-blue-600 cursor-pointer font-medium'>Login</span></p>
        }
      </form>
    </div>
  )
}

export default Login