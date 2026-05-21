import React, { useContext, useEffect, useState } from "react"
import { DoctorContext } from "../../context/DoctorContext"
import { AppContext } from "../../context/AppContext"
import axios from "axios"
import { toast } from "react-toastify"

const Profile = () => {
    const { dToken, profileData, getProfileData, backendUrl, setProfileData } = useContext(DoctorContext)
    const { currency } = useContext(AppContext)

    const [isEdit, setIsEdit] = useState(false)
    const [fees, setFees] = useState("")
    const [available, setAvailable] = useState(false)
    const [about, setAbout] = useState("")
    const [address1, setAddress1] = useState("")
    const [address2, setAddress2] = useState("")
    const [city, setCity] = useState("")
    const [clinicAddress, setClinicAddress] = useState("")
    const [lat, setLat] = useState("")
    const [lng, setLng] = useState("")

    useEffect(() => {
        if (dToken) {
            getProfileData()
        }
    }, [dToken])

    useEffect(() => {
        if (profileData) {
            setFees(profileData.fees)
            setAvailable(profileData.available)
            setAbout(profileData.about)
            setAddress1(profileData.address?.line1 || "")
            setAddress2(profileData.address?.line2 || "")
            setCity(profileData.city || "")
            setClinicAddress(profileData.clinicAddress || "")
            setLat(profileData.lat || "")
            setLng(profileData.lng || "")
        }
    }, [profileData])

    const updateProfile = async () => {
        try {
            const updateData = {
                fees: Number(fees),
                address: { line1: address1, line2: address2 },
                available,
                about,
                city,
                clinicAddress,
                lat: lat ? parseFloat(lat) : 0,
                lng: lng ? parseFloat(lng) : 0
            }

            const { data } = await axios.post(`${backendUrl}/api/doctor/update-profile`, updateData, {
                headers: { dtoken: dToken }
            })

            if (data.success) {
                toast.success(data.message)
                setIsEdit(false)
                getProfileData()
            } else {
                toast.error(data.message)
            }
        } catch (error) {
            toast.error(error.message)
        }
    }

    if (!profileData) {
        return <div className="loading-spinner"></div>
    }

    return (
        <div>
            <div className="page-title-section">
                <h1 className="page-title">My Professional Profile</h1>
                <p className="page-subtitle">Manage your consultation settings, biography, availability, and clinical location details.</p>
            </div>

            <div className="profile-container">
                {/* Profile Card Sidebar */}
                <div className="profile-sidebar-card">
                    <img 
                        className="profile-avatar-large" 
                        src={profileData.image || "https://via.placeholder.com/150"} 
                        alt={profileData.name} 
                    />
                    <h2 className="profile-name">{profileData.name}</h2>
                    <div className="profile-spec">{profileData.speciality}</div>
                    
                    <div className="switch-container" style={{ justifyContent: "center", margin: "16px 0" }}>
                        <label className="switch" htmlFor="avail-toggle">
                            <input 
                                id="avail-toggle"
                                type="checkbox" 
                                checked={available} 
                                disabled={!isEdit}
                                onChange={(e) => setAvailable(e.target.checked)}
                            />
                            <span className="slider"></span>
                        </label>
                        <span style={{ fontWeight: "600", color: available ? "var(--success)" : "var(--text-secondary)" }}>
                            {available ? "Active & Booking" : "On Vacation / Busy"}
                        </span>
                    </div>

                    <div className="profile-details-list">
                        <div className="profile-detail-item">
                            <div className="profile-detail-label">Degree</div>
                            <div className="profile-detail-value">{profileData.degree}</div>
                        </div>
                        <div className="profile-detail-item">
                            <div className="profile-detail-label">Experience</div>
                            <div className="profile-detail-value">{profileData.experience}</div>
                        </div>
                        <div className="profile-detail-item">
                            <div className="profile-detail-label">Consultation Fees</div>
                            <div className="profile-detail-value" style={{ fontSize: "16px", fontWeight: "600", color: "var(--primary)" }}>
                                {currency}{profileData.fees}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Edit Form / Professional Details Panel */}
                <div className="panel-card" style={{ margin: "0" }}>
                    <div className="panel-card-header">
                        <h2 className="panel-card-title">Professional biography & setting parameters</h2>
                        <button 
                            onClick={isEdit ? updateProfile : () => setIsEdit(true)} 
                            className="btn-primary"
                            style={{ padding: "8px 20px", fontSize: "13px" }}
                        >
                            {isEdit ? "Save Profile Changes" : "Edit Profile"}
                        </button>
                    </div>

                    <div style={{ padding: "30px", display: "flex", flexDirection: "column", gap: "24px" }}>
                        <div>
                            <h3 style={{ fontSize: "16px", marginBottom: "8px", borderBottom: "1px solid var(--border-slate)", paddingBottom: "6px" }}>About Professional</h3>
                            {isEdit ? (
                                <textarea 
                                    aria-label="About"
                                    className="form-input" 
                                    value={about} 
                                    onChange={(e) => setAbout(e.target.value)} 
                                    rows="4" 
                                />
                            ) : (
                                <p style={{ color: "var(--text-secondary)", lineHeight: "1.6", fontSize: "14px" }}>
                                    {profileData.about || "No biography provided yet."}
                                </p>
                            )}
                        </div>

                        <div className="premium-form" style={{ padding: "0", gridTemplateColumns: "1fr 1fr", gap: "20px" }}>
                            <div>
                                <label className="form-label" htmlFor="consult-fees">Consultation Fees ({currency})</label>
                                <input 
                                    id="consult-fees"
                                    type="number" 
                                    className="form-input" 
                                    value={fees} 
                                    onChange={(e) => setFees(e.target.value)} 
                                    disabled={!isEdit} 
                                />
                            </div>

                            <div>
                                <label className="form-label" htmlFor="city-input">City location</label>
                                <input 
                                    id="city-input"
                                    type="text" 
                                    className="form-input" 
                                    value={city} 
                                    onChange={(e) => setCity(e.target.value)} 
                                    disabled={!isEdit} 
                                    placeholder="Bangalore"
                                />
                            </div>

                            <div className="form-group-full">
                                <label className="form-label" htmlFor="clinic-addr">Clinic Address</label>
                                <input 
                                    id="clinic-addr"
                                    type="text" 
                                    className="form-input" 
                                    value={clinicAddress} 
                                    onChange={(e) => setClinicAddress(e.target.value)} 
                                    disabled={!isEdit} 
                                    placeholder="Medi clinic, Whitefield road"
                                />
                            </div>

                            <div>
                                <label className="form-label" htmlFor="addr-1">Address Line 1</label>
                                <input 
                                    id="addr-1"
                                    type="text" 
                                    className="form-input" 
                                    value={address1} 
                                    onChange={(e) => setAddress1(e.target.value)} 
                                    disabled={!isEdit} 
                                />
                            </div>

                            <div>
                                <label className="form-label" htmlFor="addr-2">Address Line 2</label>
                                <input 
                                    id="addr-2"
                                    type="text" 
                                    className="form-input" 
                                    value={address2} 
                                    onChange={(e) => setAddress2(e.target.value)} 
                                    disabled={!isEdit} 
                                />
                            </div>

                            <div className="form-group-full">
                                <label className="form-label" htmlFor="location-coords">Location Coordinates (Latitude, Longitude)</label>
                                <div className="form-input-row">
                                    <input 
                                        id="location-coords"
                                        type="number" 
                                        step="any"
                                        className="form-input" 
                                        value={lat} 
                                        onChange={(e) => setLat(e.target.value)} 
                                        disabled={!isEdit} 
                                        placeholder="Lat (e.g. 12.9716)"
                                    />
                                    <input 
                                        aria-label="Longitude"
                                        type="number" 
                                        step="any"
                                        className="form-input" 
                                        value={lng} 
                                        onChange={(e) => setLng(e.target.value)} 
                                        disabled={!isEdit} 
                                        placeholder="Lng (e.g. 77.5946)"
                                    />
                                </div>
                            </div>
                        </div>

                        {isEdit && (
                            <div style={{ display: "flex", gap: "10px", justifyContent: "flex-end" }}>
                                <button 
                                    onClick={() => { setIsEdit(false); getProfileData(); }} 
                                    className="btn-primary" 
                                    style={{ backgroundColor: "var(--text-muted)", color: "white" }}
                                >
                                    Cancel
                                </button>
                                <button onClick={updateProfile} className="btn-primary">
                                    Save Changes
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Profile
