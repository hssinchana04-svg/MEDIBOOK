import React, { useContext, useState } from "react"
import { AdminContext } from "../../context/AdminContext"
import axios from "axios"
import { toast } from "react-toastify"

const AddDoctor = () => {
    const [docImg, setDocImg] = useState(false)
    const [name, setName] = useState("")
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [experience, setExperience] = useState("1 Year")
    const [fees, setFees] = useState("")
    const [about, setAbout] = useState("")
    const [speciality, setSpeciality] = useState("General physician")
    const [degree, setDegree] = useState("")
    const [address1, setAddress1] = useState("")
    const [address2, setAddress2] = useState("")
    const [city, setCity] = useState("")
    const [clinicAddress, setClinicAddress] = useState("")
    const [lat, setLat] = useState("")
    const [lng, setLng] = useState("")

    const { backendUrl, aToken } = useContext(AdminContext)

    const onSubmitHandler = async (event) => {
        event.preventDefault()

        try {
            if (!docImg) {
                return toast.error("Please upload a doctor profile image")
            }

            const formData = new FormData()
            formData.append("image", docImg)
            formData.append("name", name)
            formData.append("email", email)
            formData.append("password", password)
            formData.append("experience", experience)
            formData.append("fees", Number(fees))
            formData.append("about", about)
            formData.append("speciality", speciality)
            formData.append("degree", degree)
            formData.append("city", city)
            formData.append("clinicAddress", clinicAddress)
            formData.append("lat", lat ? parseFloat(lat) : 0)
            formData.append("lng", lng ? parseFloat(lng) : 0)
            
            // Backend expects address to be JSON stringified, parsed into an object
            formData.append("address", JSON.stringify({ line1: address1, line2: address2 }))

            const { data } = await axios.post(`${backendUrl}/api/admin/add-doctor`, formData, {
                headers: { atoken: aToken }
            })

            if (data.success) {
                toast.success(data.message)
                // Reset form fields
                setDocImg(false)
                setName("")
                setEmail("")
                setPassword("")
                setFees("")
                setAbout("")
                setDegree("")
                setAddress1("")
                setAddress2("")
                setCity("")
                setClinicAddress("")
                setLat("")
                setLng("")
            } else {
                toast.error(data.message)
            }

        } catch (error) {
            toast.error(error.message)
        }
    }

    return (
        <div>
            <div className="page-title-section">
                <h1 className="page-title">Register New Doctor</h1>
                <p className="page-subtitle">Add a new medical professional to the MEDIBOOK directory. Fill in their credentials below.</p>
            </div>

            <div className="panel-card">
                <div className="panel-card-header">
                    <h2 className="panel-card-title">Doctor Credentials & Profile Details</h2>
                </div>

                <form onSubmit={onSubmitHandler} className="premium-form">
                    <div className="form-group-full image-upload-wrapper">
                        <label className="form-label">Doctor Profile Picture</label>
                        <div style={{ display: "flex", alignItems: "center", gap: "20px" }}>
                            <label htmlFor="doc-img" className="upload-label">
                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                                    <polyline points="17 8 12 3 7 8"></polyline>
                                    <line x1="12" y1="3" x2="12" y2="15"></line>
                                </svg>
                                Select Image File
                            </label>
                            <input 
                                onChange={(e) => setDocImg(e.target.files[0])} 
                                type="file" 
                                id="doc-img" 
                                hidden 
                                accept="image/*"
                            />
                            {docImg && (
                                <img 
                                    className="upload-preview" 
                                    src={URL.createObjectURL(docImg)} 
                                    alt="Preview" 
                                />
                            )}
                        </div>
                    </div>

                    <div className="form-group">
                        <label className="form-label" htmlFor="doc-name">Doctor Name</label>
                        <input 
                            id="doc-name"
                            onChange={(e) => setName(e.target.value)} 
                            value={name} 
                            type="text" 
                            className="form-input" 
                            placeholder="Dr. Alexander Fleming" 
                            required 
                        />
                    </div>

                    <div className="form-group">
                        <label className="form-label" htmlFor="doc-email">Doctor Email</label>
                        <input 
                            id="doc-email"
                            onChange={(e) => setEmail(e.target.value)} 
                            value={email} 
                            type="email" 
                            className="form-input" 
                            placeholder="alexander@medibook.com" 
                            required 
                        />
                    </div>

                    <div className="form-group">
                        <label className="form-label" htmlFor="doc-password">Portal Password</label>
                        <input 
                            id="doc-password"
                            onChange={(e) => setPassword(e.target.value)} 
                            value={password} 
                            type="password" 
                            className="form-input" 
                            placeholder="••••••••" 
                            required 
                        />
                    </div>

                    <div className="form-group">
                        <label className="form-label" htmlFor="doc-fees">Consultation Fees (INR)</label>
                        <input 
                            id="doc-fees"
                            onChange={(e) => setFees(e.target.value)} 
                            value={fees} 
                            type="number" 
                            className="form-input" 
                            placeholder="500" 
                            required 
                        />
                    </div>

                    <div className="form-group">
                        <label className="form-label" htmlFor="doc-speciality">Speciality</label>
                        <select 
                            id="doc-speciality"
                            onChange={(e) => setSpeciality(e.target.value)} 
                            value={speciality} 
                            className="form-input"
                        >
                            <option value="General physician">General physician</option>
                            <option value="Gynecologist">Gynecologist</option>
                            <option value="Dermatologist">Dermatologist</option>
                            <option value="Pediatricians">Pediatricians</option>
                            <option value="Neurologist">Neurologist</option>
                            <option value="Gastroenterologist">Gastroenterologist</option>
                        </select>
                    </div>

                    <div className="form-group">
                        <label className="form-label" htmlFor="doc-degree">Education Degree</label>
                        <input 
                            id="doc-degree"
                            onChange={(e) => setDegree(e.target.value)} 
                            value={degree} 
                            type="text" 
                            className="form-input" 
                            placeholder="MBBS, MD, FRCP" 
                            required 
                        />
                    </div>

                    <div className="form-group">
                        <label className="form-label" htmlFor="doc-experience">Experience Duration</label>
                        <select 
                            id="doc-experience"
                            onChange={(e) => setExperience(e.target.value)} 
                            value={experience} 
                            className="form-input"
                        >
                            <option value="1 Year">1 Year</option>
                            <option value="2 Years">2 Years</option>
                            <option value="3 Years">3 Years</option>
                            <option value="4 Years">4 Years</option>
                            <option value="5 Years">5 Years</option>
                            <option value="6 Years">6 Years</option>
                            <option value="7 Years">7 Years</option>
                            <option value="8 Years">8 Years</option>
                            <option value="9 Years">9 Years</option>
                            <option value="10 Years">10 Years</option>
                            <option value="12 Years">12 Years</option>
                            <option value="15+ Years">15+ Years</option>
                        </select>
                    </div>

                    <div className="form-group">
                        <label className="form-label" htmlFor="doc-city">City Name</label>
                        <input 
                            id="doc-city"
                            onChange={(e) => setCity(e.target.value)} 
                            value={city} 
                            type="text" 
                            className="form-input" 
                            placeholder="Bangalore" 
                        />
                    </div>

                    <div className="form-group">
                        <label className="form-label" htmlFor="doc-clinic-address">Clinic Address</label>
                        <input 
                            id="doc-clinic-address"
                            onChange={(e) => setClinicAddress(e.target.value)} 
                            value={clinicAddress} 
                            type="text" 
                            className="form-input" 
                            placeholder="Medi clinic, 100 Ft road" 
                        />
                    </div>

                    <div className="form-group">
                        <label className="form-label" htmlFor="doc-coordinates">Location Coordinates (Latitude, Longitude)</label>
                        <div className="form-input-row">
                            <input 
                                id="doc-coordinates"
                                onChange={(e) => setLat(e.target.value)} 
                                value={lat} 
                                type="number" 
                                step="any"
                                className="form-input" 
                                placeholder="Lat (e.g. 12.9716)" 
                            />
                            <input 
                                aria-label="Longitude"
                                onChange={(e) => setLng(e.target.value)} 
                                value={lng} 
                                type="number" 
                                step="any"
                                className="form-input" 
                                placeholder="Lng (e.g. 77.5946)" 
                            />
                        </div>
                    </div>

                    <div className="form-group">
                        <label className="form-label" htmlFor="doc-address-1">Clinic Address Line 1</label>
                        <input 
                            id="doc-address-1"
                            onChange={(e) => setAddress1(e.target.value)} 
                            value={address1} 
                            type="text" 
                            className="form-input" 
                            placeholder="17th Cross, Richmond Circle" 
                            required 
                        />
                    </div>

                    <div className="form-group">
                        <label className="form-label" htmlFor="doc-address-2">Clinic Address Line 2</label>
                        <input 
                            id="doc-address-2"
                            onChange={(e) => setAddress2(e.target.value)} 
                            value={address2} 
                            type="text" 
                            className="form-input" 
                            placeholder="Bangalore, Karnataka" 
                            required 
                        />
                    </div>

                    <div className="form-group-full">
                        <label className="form-label" htmlFor="doc-about">Professional Biography (About)</label>
                        <textarea 
                            id="doc-about"
                            onChange={(e) => setAbout(e.target.value)} 
                            value={about} 
                            className="form-input" 
                            placeholder="Describe the doctor's qualifications, expertise, and patient approach in detail..." 
                            rows="4" 
                            required 
                        />
                    </div>

                    <div className="form-group-full" style={{ textAlign: "right", marginTop: "10px" }}>
                        <button type="submit" className="btn-primary">
                            Register Doctor Profile
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
}

export default AddDoctor
