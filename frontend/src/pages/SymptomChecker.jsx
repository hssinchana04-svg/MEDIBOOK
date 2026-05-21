import React, { useState, useContext } from 'react'
import { useNavigate } from 'react-router-dom'
import { AppContext } from '../context/AppContext'
import axios from 'axios'
import { toast } from 'react-toastify'

const SymptomChecker = () => {
  const { token, backendUrl } = useContext(AppContext)
  const navigate = useNavigate()

  const [symptoms, setSymptoms] = useState('')
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState(null)

  const sampleSymptoms = [
    "I have had a high fever and sore throat for the past two days.",
    "My skin has developed a red, itchy rash with small bumps.",
    "I feel a dull pain in my stomach after eating, along with bloating.",
    "I have been experiencing frequent headaches and occasional dizziness."
  ]

  const handleAnalyze = async (e) => {
    e.preventDefault()
    if (!symptoms.trim()) {
      return toast.warn("Please enter some symptoms first.")
    }

    setLoading(true)
    setResult(null)

    try {
      const { data } = await axios.post(
        `${backendUrl}/api/user/symptom-check`,
        { symptoms },
        { headers: { token } }
      )

      if (data.success) {
        setResult(data)
        toast.success("Analysis complete!")
      } else {
        toast.error(data.message || "Failed to analyze symptoms.")
      }
    } catch (error) {
      console.error(error)
      toast.error(error.response?.data?.message || error.message)
    } finally {
      setLoading(false)
    }
  }

  // Helper for urgency color badge
  const getUrgencyStyles = (urgency) => {
    switch (urgency?.toLowerCase()) {
      case 'emergency':
        return 'bg-red-100 text-red-700 border-red-200 animate-pulse'
      case 'high':
        return 'bg-orange-100 text-orange-700 border-orange-200'
      case 'medium':
        return 'bg-yellow-100 text-yellow-700 border-yellow-200'
      case 'low':
      default:
        return 'bg-green-100 text-green-700 border-green-200'
    }
  }

  // If user is not logged in, show an login prompt screen
  if (!token) {
    return (
      <div className='flex flex-col items-center justify-center min-h-[60vh] text-center p-6 bg-white rounded-2xl shadow-sm border border-gray-100 my-8'>
        <div className='w-16 h-16 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center text-3xl mb-4'>
          🔐
        </div>
        <h2 className='text-2xl font-bold text-gray-800 mb-2'>Access Restricted</h2>
        <p className='text-gray-500 max-w-md mb-6'>
          To protect your health data and match you with specialists, you must be logged in to use the Symptom Checker.
        </p>
        <button
          onClick={() => navigate('/login')}
          className='bg-blue-600 hover:bg-blue-700 text-white font-semibold px-8 py-3 rounded-full shadow-md transition-all hover:scale-105'
        >
          Log In or Create Account
        </button>
      </div>
    )
  }

  return (
    <div className='max-w-4xl mx-auto my-8 p-1'>
      <div className='text-center mb-8'>
        <h1 className='text-3xl font-bold text-gray-800 flex items-center justify-center gap-2 mb-2'>
          🩺 AI Symptom Checker
        </h1>
        <p className='text-gray-500 max-w-xl mx-auto'>
          Describe what you are experiencing. Gemini AI will analyze your symptoms, suggest the right specialist category, and show matching doctors you can book immediately.
        </p>
      </div>

      <div className='grid grid-cols-1 md:grid-cols-3 gap-6'>
        {/* Left Input Section */}
        <div className='md:col-span-1 bg-white p-5 rounded-2xl border border-gray-100 shadow-sm h-fit'>
          <h3 className='font-semibold text-gray-800 mb-3'>💡 Quick Start</h3>
          <p className='text-xs text-gray-500 mb-4'>
            Click any sample symptom below to pre-fill the checker, or write your own symptoms.
          </p>
          <div className='flex flex-col gap-2.5'>
            {sampleSymptoms.map((sample, idx) => (
              <button
                key={idx}
                onClick={() => setSymptoms(sample)}
                className='text-left text-xs p-3 rounded-xl border border-gray-100 bg-gray-50 hover:bg-blue-50 hover:border-blue-200 transition-all text-gray-600 hover:text-blue-700 font-medium'
              >
                {sample}
              </button>
            ))}
          </div>
        </div>

        {/* Right Form and Result Section */}
        <div className='md:col-span-2 flex flex-col gap-6'>
          <form onSubmit={handleAnalyze} className='bg-white p-6 rounded-2xl border border-gray-100 shadow-sm'>
            <div className='mb-4'>
              <label htmlFor="symptom-input" className='block text-sm font-semibold text-gray-700 mb-2'>
                Describe your symptoms in detail:
              </label>
              <textarea
                id="symptom-input"
                className='w-full min-h-[140px] p-4 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-gray-700 resize-none transition-all placeholder:text-gray-400'
                placeholder='Describe pain level, location, duration, and any accompanying symptoms (e.g., fever, skin changes, nausea)...'
                value={symptoms}
                onChange={(e) => setSymptoms(e.target.value)}
                disabled={loading}
              />
            </div>

            <div className='flex justify-end'>
              <button
                type='submit'
                disabled={loading || !symptoms.trim()}
                className={`flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold px-8 py-3 rounded-full transition-all shadow-md ${
                  (loading || !symptoms.trim()) ? 'opacity-50 cursor-not-allowed' : 'hover:scale-105'
                }`}
              >
                {loading ? (
                  <>
                    <svg className="animate-spin h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Analyzing...
                  </>
                ) : (
                  <>
                    ✨ Analyze Symptoms
                  </>
                )}
              </button>
            </div>
          </form>

          {/* Results display */}
          {result && (
            <div className='bg-white p-6 rounded-2xl border border-blue-100 shadow-lg animate-fade-in flex flex-col gap-6'>
              <div className='flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gray-100 pb-4'>
                <div>
                  <span className='text-xs font-bold uppercase tracking-wider text-blue-500'>Gemini Diagnosis Suggestion</span>
                  <h2 className='text-2xl font-bold text-gray-800 mt-0.5'>
                    {result.aiData.speciality}
                  </h2>
                </div>
                <div className={`px-4 py-1.5 rounded-full border text-xs font-semibold w-fit ${getUrgencyStyles(result.aiData.urgency)}`}>
                  Urgency: {result.aiData.urgency}
                </div>
              </div>

              <div>
                <h4 className='font-semibold text-gray-800 mb-2'>📋 AI Assessment & Advice</h4>
                <p className='text-gray-600 text-sm leading-relaxed whitespace-pre-line'>
                  {result.aiData.explanation}
                </p>
              </div>

              <div>
                <h4 className='font-semibold text-gray-800 mb-4 flex items-center gap-1.5'>
                  🧑‍⚕️ Available Matching Specialists ({result.doctors?.length || 0})
                </h4>
                {result.doctors && result.doctors.length > 0 ? (
                  <div className='grid grid-cols-1 sm:grid-cols-2 gap-4'>
                    {result.doctors.map((doc) => (
                      <div
                        key={doc._id}
                        className='p-4 border border-gray-100 rounded-xl hover:border-blue-200 bg-gray-50/50 hover:bg-blue-50/30 transition-all flex gap-3'
                      >
                        <img
                          src={doc.image}
                          alt={doc.name}
                          className='w-14 h-14 rounded-full object-cover bg-blue-100 border border-gray-100'
                        />
                        <div className='flex-1 min-w-0'>
                          <div className='flex items-center gap-1.5 mb-0.5'>
                            <span className={`w-1.5 h-1.5 rounded-full ${doc.available ? 'bg-green-500' : 'bg-red-400'}`}></span>
                            <span className={`text-[10px] font-medium ${doc.available ? 'text-green-600' : 'text-red-400'}`}>
                              {doc.available ? 'Available' : 'Unavailable'}
                            </span>
                          </div>
                          <p className='font-bold text-gray-800 text-sm truncate'>{doc.name}</p>
                          <p className='text-xs text-gray-500 truncate mb-2'>{doc.degree} • {doc.experience} exp</p>
                          
                          <button
                            onClick={() => navigate(`/appointment/${doc._id}`)}
                            className='bg-blue-600 hover:bg-blue-700 text-white font-medium text-xs px-4 py-1.5 rounded-full transition-all shadow-sm'
                          >
                            Book Now
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className='text-center p-6 border border-dashed border-gray-200 rounded-xl bg-gray-50'>
                    <p className='text-gray-500 text-sm mb-3'>
                      No available {result.aiData.speciality.toLowerCase()} doctors found in our immediate database at the moment.
                    </p>
                    <button
                      onClick={() => navigate('/doctors')}
                      className='text-blue-600 hover:text-blue-700 text-xs font-semibold hover:underline'
                    >
                      Browse all doctors instead &rarr;
                    </button>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default SymptomChecker
