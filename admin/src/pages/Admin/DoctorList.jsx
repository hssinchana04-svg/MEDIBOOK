import React, { useContext, useEffect } from "react"
import { AdminContext } from "../../context/AdminContext"

const DoctorList = () => {
    const { doctors, getAllDoctors, changeAvailability, aToken } = useContext(AdminContext)

    useEffect(() => {
        if (aToken) {
            getAllDoctors()
        }
    }, [aToken])

    return (
        <div>
            <div className="page-title-section">
                <h1 className="page-title">Registered Doctors</h1>
                <p className="page-subtitle">View credentials, specialities, and manage doctor listing status on the platform.</p>
            </div>

            {doctors.length === 0 ? (
                <div style={{ textAlign: "center", padding: "50px", backgroundColor: "var(--bg-card)", borderRadius: "var(--radius-lg)", border: "1px solid var(--border-slate)" }}>
                    <div className="loading-spinner" style={{ marginBottom: "20px" }}></div>
                    <p style={{ color: "var(--text-secondary)", fontWeight: "500" }}>Retrieving registered doctors...</p>
                </div>
            ) : (
                <div className="doctor-grid">
                    {doctors.map((item, index) => (
                        <div key={item._id || index} className="doctor-card">
                            <div className="doctor-card-img-container">
                                <img 
                                    src={item.image || "https://via.placeholder.com/280x220"} 
                                    alt={item.name} 
                                    className="doctor-card-img" 
                                />
                            </div>
                            <div className="doctor-card-content">
                                <span className="doctor-card-speciality">{item.speciality}</span>
                                <h3 className="doctor-card-name">{item.name}</h3>
                                <p className="doctor-card-degree">{item.degree} • {item.experience} Exp</p>
                                
                                <div style={{ fontSize: "13px", color: "var(--text-secondary)", marginBottom: "15px", display: "flex", flexDirection: "column", gap: "4px" }}>
                                    <div><strong>Fees:</strong> ₹{item.fees}</div>
                                    <div><strong>City:</strong> {item.city || "Not set"}</div>
                                </div>

                                <div className="doctor-card-footer">
                                    <div className="switch-container">
                                        <label className="switch" htmlFor={`toggle-${item._id}`}>
                                            <input 
                                                id={`toggle-${item._id}`}
                                                type="checkbox" 
                                                checked={item.available} 
                                                onChange={() => changeAvailability(item._id)}
                                            />
                                            <span className="slider"></span>
                                        </label>
                                        <span>{item.available ? "Available" : "Unavailable"}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    )
}

export default DoctorList
