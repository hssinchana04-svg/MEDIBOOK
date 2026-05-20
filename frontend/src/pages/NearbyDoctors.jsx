import React, { useEffect, useState, useContext } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import { toast } from 'react-toastify'
import { AppContext } from '../context/AppContext'
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet'
import 'leaflet/dist/leaflet.css'
import L from 'leaflet'

delete L.Icon.Default.prototype._getIconUrl
L.Icon.Default.mergeOptions({
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
})

const specialities = ['All', 'General physician', 'Gynecologist', 'Dermatologist', 'Pediatricians', 'Neurologist', 'Gastroenterologist']

const NearbyDoctors = () => {
  const navigate = useNavigate()
  const { backendUrl } = useContext(AppContext)
  const [doctors, setDoctors] = useState([])
  const [loading, setLoading] = useState(false)
  const [location, setLocation] = useState(null)
  const [radius, setRadius] = useState(10)
  const [speciality, setSpeciality] = useState('All')

  const getNearby = async (lat, lng) => {
    try {
      setLoading(true)
      const { data } = await axios.get(`${backendUrl}/api/doctor/nearby`, {
        params: { lat, lng, radius, speciality }
      })
      if (data.success) setDoctors(data.doctors)
      else toast.error(data.message)
    } catch (error) {
      toast.error(error.message)
    } finally {
      setLoading(false)
    }
  }

  const detectLocation = () => {
    if (!navigator.geolocation) { toast.error("Geolocation not supported"); return }
    setLoading(true)
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const { latitude, longitude } = pos.coords
        setLocation({ lat: latitude, lng: longitude })
        getNearby(latitude, longitude)
        toast.success("Location detected!")
      },
      () => { toast.error("Could not get location"); setLoading(false) }
    )
  }

  useEffect(() => {
    if (location) getNearby(location.lat, location.lng)
  }, [radius, speciality])

  return (
    <div>
      <h2 className='text-2xl font-bold text-gray-800 mb-2'>Doctors Near You</h2>
      <p className='text-gray-500 mb-6'>Find available doctors in your area</p>

      {/* Controls */}
      <div className='bg-blue-50 rounded-2xl p-6 mb-8'>
        <div className='flex flex-col md:flex-row gap-4 items-end'>
          <div className='flex-1'>
            <label className='text-sm text-gray-600 font-medium'>Search Radius: {radius} km</label>
            <input
              type='range' min='1' max='50' value={radius}
              onChange={e => setRadius(e.target.value)}
              className='w-full mt-2'
            />
          </div>
          <div>
            <label className='text-sm text-gray-600 font-medium'>Speciality</label>
            <select
              value={speciality}
              onChange={e => setSpeciality(e.target.value)}
              className='w-full border border-gray-300 rounded-lg px-3 py-2 mt-1 focus:outline-none focus:border-blue-500'
            >
              {specialities.map((s, i) => <option key={i} value={s}>{s}</option>)}
            </select>
          </div>
          <button
            onClick={detectLocation}
            className='bg-blue-600 text-white px-6 py-2.5 rounded-full font-medium hover:bg-blue-700 flex items-center gap-2'
          >
            📍 Detect My Location
          </button>
        </div>
      </div>

      {/* 🗺️ MAP - shows once location is detected and doctors are found */}
      {location && doctors.length > 0 && (
        <div className='mb-8 rounded-2xl overflow-hidden border border-gray-200'>
          <MapContainer
            center={[location.lat, location.lng]}
            zoom={13}
            style={{ height: '400px', width: '100%' }}
          >
            <TileLayer
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              attribution="&copy; OpenStreetMap contributors"
            />

            {/* Your location */}
            <Marker position={[location.lat, location.lng]}>
              <Popup>📍 You are here</Popup>
            </Marker>

            {/* Doctor markers */}
            {doctors.map((doc) => (
              doc.lat && doc.lng && (
                <Marker key={doc._id} position={[doc.lat, doc.lng]}>
                  <Popup>
                    <div style={{ minWidth: '140px' }}>
                      <p style={{ fontWeight: 600, marginBottom: 2 }}>{doc.name}</p>
                      <p style={{ fontSize: 12, color: '#555', marginBottom: 2 }}>{doc.speciality}</p>
                      <p style={{ fontSize: 12, color: '#2563eb', marginBottom: 6 }}>
                        {doc.distanceKm ? doc.distanceKm.toFixed(1) + ' km away' : ''}
                      </p>
                      <a
                        href={`https://www.google.com/maps/dir/?api=1&destination=${doc.lat},${doc.lng}`}
                        target="_blank"
                        rel="noreferrer"
                        style={{ fontSize: 12, color: '#2563eb' }}
                      >
                        Get directions  
                      </a>
                    </div>
                  </Popup>
                </Marker>
              )
            ))}
          </MapContainer>
        </div>
      )}

      {/* Results */}
      {loading
        ? <div className='text-center py-20'><div className='text-4xl mb-4'>⏳</div><p className='text-gray-500'>Finding doctors near you...</p></div>
        : !location
        ? <div className='text-center py-20'><div className='text-5xl mb-4'>📍</div><p className='text-gray-500'>Click "Detect My Location" to find nearby doctors</p></div>
        : doctors.length === 0
        ? <div className='text-center py-20'><div className='text-5xl mb-4'>🔍</div><p className='text-gray-500'>No doctors found within {radius} km</p></div>
        : <div className='grid grid-cols-2 md:grid-cols-4 gap-4'>
            {doctors.map((doc) => (
              <div
                key={doc._id}
                onClick={() => navigate(`/appointment/${doc._id}`)}
                className='border border-gray-200 rounded-xl overflow-hidden hover:shadow-lg cursor-pointer transition-all hover:-translate-y-1'
              >
                <img src={doc.image} className='w-full h-40 object-cover bg-blue-50' alt='' />
                <div className='p-3'>
                  <div className='flex items-center gap-1 mb-1'>
                    <span className='w-2 h-2 rounded-full bg-green-500'></span>
                    <span className='text-xs text-green-600'>Available</span>
                  </div>
                  <p className='font-semibold text-gray-800 text-sm'>{doc.name}</p>
                  <p className='text-gray-500 text-xs'>{doc.speciality}</p>
                  <p className='text-blue-600 text-xs font-medium mt-1'>₹{doc.fees}</p>
                  {doc.distanceKm && <p className='text-gray-400 text-xs mt-0.5'>📍 {doc.distanceKm.toFixed(1)} km away</p>}
                  {doc.city && <p className='text-gray-400 text-xs mt-0.5'>{doc.city}</p>}
                </div>
              </div>
            ))}
          </div>
      }
    </div>
  )
}

export default NearbyDoctors
