import React, { useContext, useEffect } from "react"
import { DoctorContext } from "../../context/DoctorContext"
import { AppContext } from "../../context/AppContext"

const Dashboard = () => {
    const { dToken, appointments, getAppointments, completeAppointment, cancelAppointment } = useContext(DoctorContext)
    const { slotDateFormat, currency } = useContext(AppContext)

    useEffect(() => {
        if (dToken) {
            getAppointments()
        }
    }, [dToken])

    // Calculate metrics
    let totalEarnings = 0
    let uniquePatients = new Set()
    
    appointments.forEach((item) => {
        if (item.isCompleted && !item.cancelled) {
            totalEarnings += item.amount
        }
        if (item.userData?.name) {
            uniquePatients.add(item.userData.name)
        }
    })

    const latestAppointments = [...appointments].reverse().slice(0, 5)

    if (!appointments) {
        return <div className="loading-spinner"></div>
    }

    return (
        <div>
            <div className="page-title-section">
                <h1 className="page-title">Doctor Dashboard</h1>
                <p className="page-subtitle">Welcome back! Review your earnings, appointments, and manage upcoming medical sessions.</p>
            </div>

            <div className="stats-grid">
                <div className="stat-card">
                    <div className="stat-icon-box success">
                        <svg viewBox="0 0 24 24">
                            <rect x="2" y="4" width="20" height="12" rx="2"></rect>
                            <circle cx="12" cy="10" r="2"></circle>
                            <line x1="2" y1="10" x2="6" y2="10"></line>
                            <line x1="22" y1="10" x2="18" y2="10"></line>
                        </svg>
                    </div>
                    <div className="stat-details">
                        <h3>{currency}{totalEarnings}</h3>
                        <p>Total Earnings</p>
                    </div>
                </div>

                <div className="stat-card">
                    <div className="stat-icon-box primary">
                        <svg viewBox="0 0 24 24">
                            <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                            <line x1="16" y1="2" x2="16" y2="6"></line>
                            <line x1="8" y1="2" x2="8" y2="6"></line>
                            <line x1="3" y1="10" x2="21" y2="10"></line>
                        </svg>
                    </div>
                    <div className="stat-details">
                        <h3>{appointments.length}</h3>
                        <p>Total Bookings</p>
                    </div>
                </div>

                <div className="stat-card">
                    <div className="stat-icon-box info">
                        <svg viewBox="0 0 24 24">
                            <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                            <circle cx="9" cy="7" r="4"></circle>
                        </svg>
                    </div>
                    <div className="stat-details">
                        <h3>{uniquePatients.size}</h3>
                        <p>Unique Patients</p>
                    </div>
                </div>
            </div>

            <div className="panel-card">
                <div className="panel-card-header">
                    <h2 className="panel-card-title">Recent Session Bookings</h2>
                </div>
                <div className="table-responsive">
                    <table className="premium-table">
                        <thead>
                            <tr>
                                <th>#</th>
                                <th>Patient</th>
                                <th>Session Date & Time</th>
                                <th>Payment</th>
                                <th>Amount</th>
                                <th style={{ textAlign: "right" }}>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {latestAppointments.length === 0 ? (
                                <tr>
                                    <td colSpan="6" style={{ textAlign: "center", padding: "30px", color: "var(--text-secondary)" }}>
                                        No recent appointments booked for you yet.
                                    </td>
                                </tr>
                            ) : (
                                latestAppointments.map((item, index) => (
                                    <tr key={item._id || index}>
                                        <td>{index + 1}</td>
                                        <td>
                                            <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                                                <img 
                                                    src={item.userData.image || "https://via.placeholder.com/32"} 
                                                    alt="" 
                                                    style={{ width: "32px", height: "32px", borderRadius: "50%", objectFit: "cover" }} 
                                                />
                                                <div>
                                                    <span style={{ fontWeight: "500", display: "block" }}>{item.userData.name}</span>
                                                    {item.patientDetails?.name && (
                                                        <span style={{ fontSize: "11px", color: "var(--text-secondary)" }}>
                                                            For: {item.patientDetails.name} ({item.patientDetails.age} Yrs)
                                                        </span>
                                                    )}
                                                </div>
                                            </div>
                                        </td>
                                        <td>
                                            <div style={{ fontWeight: "500" }}>{slotDateFormat(item.slotDate)}</div>
                                            <div style={{ fontSize: "12px", color: "var(--text-secondary)" }}>{item.slotTime}</div>
                                        </td>
                                        <td>
                                            <span className={`status-pill ${item.payment ? "active" : "pending"}`}>
                                                {item.payment ? "Paid" : "Pending"}
                                            </span>
                                        </td>
                                        <td>
                                            <span style={{ fontWeight: "600" }}>{currency}{item.amount}</span>
                                        </td>
                                        <td style={{ textAlign: "right" }}>
                                            {item.cancelled ? (
                                                <span className="status-pill cancelled">Cancelled</span>
                                            ) : item.isCompleted ? (
                                                <span className="status-pill completed">Completed</span>
                                            ) : (
                                                <div style={{ display: "flex", justifyContent: "flex-end", gap: "8px" }}>
                                                    <button 
                                                        onClick={() => cancelAppointment(item._id)} 
                                                        className="action-icon-btn danger"
                                                        title="Cancel Appointment"
                                                    >
                                                        <svg viewBox="0 0 24 24">
                                                            <circle cx="12" cy="12" r="10"></circle>
                                                            <line x1="15" y1="9" x2="9" y2="15"></line>
                                                            <line x1="9" y1="9" x2="15" y2="15"></line>
                                                        </svg>
                                                    </button>
                                                    <button 
                                                        onClick={() => completeAppointment(item._id)} 
                                                        className="action-icon-btn success"
                                                        title="Complete Session"
                                                    >
                                                        <svg viewBox="0 0 24 24">
                                                            <polyline points="20 6 9 17 4 12"></polyline>
                                                        </svg>
                                                    </button>
                                                </div>
                                            )}
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    )
}

export default Dashboard
