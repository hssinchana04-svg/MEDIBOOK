import React, { useState, useContext } from 'react'
import { useNavigate } from 'react-router-dom'
import { AppContext } from '../context/AppContext'
import axios from 'axios'
import { toast } from 'react-toastify'

const PrescriptionScanner = () => {
  const { token, backendUrl } = useContext(AppContext)
  const navigate = useNavigate()

  const [image, setImage] = useState(null)
  const [previewUrl, setPreviewUrl] = useState(null)
  const [loading, setLoading] = useState(false)
  const [scannedData, setScannedData] = useState(null)
  const [dragActive, setDragActive] = useState(false)

  const handleFileChange = (file) => {
    if (!file) return

    if (!file.type.startsWith('image/')) {
      return toast.error("Please upload an image file (PNG, JPG, JPEG, WebP).")
    }

    setImage(file)
    setPreviewUrl(URL.createObjectURL(file))
    setScannedData(null) // clear previous scan
  }

  const handleDrag = (e) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true)
    } else if (e.type === "dragleave") {
      setDragActive(false)
    }
  }

  const handleDrop = (e) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileChange(e.dataTransfer.files[0])
    }
  }

  const handleClear = () => {
    setImage(null)
    setPreviewUrl(null)
    setScannedData(null)
  }

  const handleScan = async () => {
    if (!image) {
      return toast.warn("Please upload a prescription image first.")
    }

    setLoading(true)
    const formData = new FormData()
    formData.append('image', image)

    try {
      const { data } = await axios.post(
        `${backendUrl}/api/user/scan-prescription`,
        formData,
        {
          headers: {
            token,
            'Content-Type': 'multipart/form-data'
          }
        }
      )

      if (data.success) {
        setScannedData(data)
        toast.success("Prescription scanned successfully!")
      } else {
        toast.error(data.message || "Could not read prescription. Please try a clearer image.")
        setScannedData(data) // displays error message UI
      }
    } catch (error) {
      console.error(error)
      toast.error(error.response?.data?.message || error.message)
    } finally {
      setLoading(false)
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
          Prescription scanning contains sensitive health information. Please log in to your account to upload and scan prescriptions.
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
          📄 Prescription Scanner
        </h1>
        <p className='text-gray-500 max-w-xl mx-auto'>
          Upload a clear photo of your prescription. Gemini AI will run OCR to read the text and list the extracted medicines, dosages, and instructions in a structured format.
        </p>
      </div>

      <div className='grid grid-cols-1 md:grid-cols-2 gap-8'>
        {/* Left Side: Upload & Preview */}
        <div className='flex flex-col gap-4'>
          <div className='bg-white p-5 rounded-2xl border border-gray-100 shadow-sm flex-1 flex flex-col'>
            <h3 className='font-semibold text-gray-800 mb-4'>📤 Upload Prescription</h3>

            {!previewUrl ? (
              <div
                onDragEnter={handleDrag}
                onDragOver={handleDrag}
                onDragLeave={handleDrag}
                onDrop={handleDrop}
                className={`border-2 border-dashed rounded-xl flex-1 flex flex-col items-center justify-center p-8 text-center cursor-pointer transition-all ${
                  dragActive
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-gray-200 hover:border-blue-400 hover:bg-gray-50/50'
                }`}
                onClick={() => document.getElementById('prescription-upload').click()}
              >
                <input
                  type="file"
                  id="prescription-upload"
                  className="hidden"
                  accept="image/*"
                  onChange={(e) => handleFileChange(e.target.files[0])}
                />
                <div className='text-4xl mb-3'>📸</div>
                <p className='text-sm font-semibold text-gray-700 mb-1'>Drag & drop image here</p>
                <p className='text-xs text-gray-400'>or click to browse from device (JPG, PNG, WebP)</p>
              </div>
            ) : (
              <div className='relative border border-gray-100 rounded-xl overflow-hidden flex-1 bg-gray-50 flex items-center justify-center min-h-[300px]'>
                <img
                  src={previewUrl}
                  alt="Prescription preview"
                  className='max-h-[380px] w-auto object-contain'
                />
                <button
                  onClick={handleClear}
                  disabled={loading}
                  className='absolute top-3 right-3 bg-red-500 hover:bg-red-600 text-white w-8 h-8 rounded-full flex items-center justify-center font-bold shadow-md transition-all active:scale-95 text-xs'
                >
                  ✕
                </button>
              </div>
            )}

            <div className='mt-5 flex gap-3'>
              {previewUrl && (
                <button
                  onClick={handleScan}
                  disabled={loading}
                  className={`flex-1 flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-xl transition-all shadow-md ${
                    loading ? 'opacity-50 cursor-not-allowed' : 'hover:scale-[1.02]'
                  }`}
                >
                  {loading ? (
                    <>
                      <svg className="animate-spin h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Scanning Image...
                    </>
                  ) : (
                    <>
                      🔍 Scan Prescription
                    </>
                  )}
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Right Side: Scan Results */}
        <div className='flex flex-col gap-4'>
          <div className='bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex-1 flex flex-col min-h-[300px]'>
            <h3 className='font-semibold text-gray-800 mb-4 flex items-center gap-1.5'>
              📋 Scan Results
            </h3>

            {!scannedData && !loading && (
              <div className='flex-1 flex flex-col items-center justify-center text-center p-6 bg-gray-50/50 rounded-xl border border-dashed border-gray-100'>
                <div className='text-4xl mb-2'>💤</div>
                <p className='text-sm text-gray-500 font-medium'>No prescription scanned yet</p>
                <p className='text-xs text-gray-400 mt-1 max-w-[240px]'>
                  Upload a photo on the left and click Scan to extract medical information.
                </p>
              </div>
            )}

            {loading && (
              <div className='flex-1 flex flex-col items-center justify-center text-center p-6'>
                <div className='text-4xl mb-4 animate-bounce'>🧪</div>
                <p className='text-sm font-semibold text-blue-600 animate-pulse'>Gemini AI reading prescription...</p>
                <p className='text-xs text-gray-400 mt-1 max-w-[240px]'>
                  Analyzing handwriting, medicine names, strengths, and dosage frequency.
                </p>
              </div>
            )}

            {scannedData && (
              <div className='flex-1 flex flex-col gap-4 animate-fade-in'>
                {scannedData.success ? (
                  <>
                    <div className='bg-green-50 border border-green-100 text-green-700 px-4 py-2.5 rounded-xl text-xs font-semibold flex items-center gap-2'>
                      ✨ Medicines Successfully Scanned ({scannedData.medicines?.length || 0})
                    </div>
                    
                    <div className='overflow-x-auto border border-gray-100 rounded-xl shadow-inner max-h-[380px]'>
                      <table className='min-w-full divide-y divide-gray-100 text-left text-xs'>
                        <thead className='bg-gray-50 text-gray-700 font-semibold uppercase tracking-wider sticky top-0'>
                          <tr>
                            <th className='px-4 py-3'>Medicine</th>
                            <th className='px-4 py-3'>Dosage</th>
                            <th className='px-4 py-3'>Frequency</th>
                            <th className='px-4 py-3'>Purpose</th>
                          </tr>
                        </thead>
                        <tbody className='divide-y divide-gray-100 bg-white text-gray-600'>
                          {scannedData.medicines.map((med, index) => (
                            <tr key={index} className='hover:bg-gray-50/50 transition-colors'>
                              <td className='px-4 py-3 font-semibold text-gray-800'>{med.name}</td>
                              <td className='px-4 py-3'>{med.dosage}</td>
                              <td className='px-4 py-3'>{med.frequency}</td>
                              <td className='px-4 py-3 italic text-gray-500'>{med.purpose}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </>
                ) : (
                  <div className='flex-1 flex flex-col items-center justify-center text-center p-6 bg-red-50/50 rounded-xl border border-dashed border-red-100'>
                    <div className='text-4xl mb-2'>⚠️</div>
                    <p className='text-sm text-red-700 font-semibold'>Scan Failed</p>
                    <p className='text-xs text-red-600 mt-1 max-w-[260px]'>
                      {scannedData.message || "We couldn't recognize any medicines in this prescription. Please ensure it's a clear, well-lit photo of a valid prescription and try again."}
                    </p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default PrescriptionScanner
