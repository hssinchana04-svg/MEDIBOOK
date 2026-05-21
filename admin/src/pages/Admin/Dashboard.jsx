import React, { useContext, useEffect } from "react"
import { AdminContext } from "../../context/AdminContext"
import { AppContext } from "../../context/AppContext"

const Dashboard = () => {
    const { aToken, dashData, getDashData, cancelAppointment } = useContext(AdminContext)
    const { slotDateFormat, currency } = useContext(AppContext)

    useEffect(() => {
        if (aToken) {
            getDashData()
        }
    }, [aToken])

    if (!dashData) {
        return <div className="loading-spinner"></div>
    }

    return (
        <div>
            <div className="page-title-section">
                <h1 className="page-title">Dashboard Overview</h1>
                <p className="page-subtitle">Welcome to the Medibook Administration Portal. Here is your overview.</p>
            </div>

            <div className="stats-grid">
                <div className="stat-card">
                    <div className="stat-icon-box primary">
                        <svg viewBox="0 0 24 24">
                            <path d="M4.82 18.23l1.22-3.14a4 4 0 0 1 7.47 0l1.22 3.14M12 9a3 3 0 1 0 0-6 3 3 0 0 0 0 6z"></path>
                        </svg>
                    </div>
                    <div className="stat-details">
                        <h3>{dashData.doctors}</h3>
                        <p>Total Doctors</p>
                    </div>
                </div>

                <div className="stat-card">
                    <div className="stat-icon-box success">
                        <svg viewBox="0 0 24 24">
                            <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                            <line x1="16" y1="2" x2="16" y2="6"></line>
                            <line x1="8" y1="2" x2="8" y2="6"></line>
                            <line x1="3" y1="10" x2="21" y2="10"></line>
                        </svg>
                    </div>
                    <div className="stat-details">
                        <h3>{dashData.appointments}</h3>
                        <p>Total Appointments</p>
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
                        <h3>{dashData.patients}</h3>
                        <p>Total Patients</p>
                    </div>
                </div>
            </div>

            <div className="panel-card">
                <div className="panel-card-header">
                    <h2 className="panel-card-title">Latest Appointments</h2>
                </div>
                <div className="table-responsive">
                    <table className="premium-table">
                        <thead>
                            <tr>
                                <th>#</th>
                                <th>Patient</th>
                                <th>Doctor</th>
                                <th>Date & Time</th>
                                <th>Amount</th>
                                <th style={{ textAlign: "right" }}>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {dashData.latestAppointments.length === 0 ? (
                                <tr>
                                    <td colSpan="6" style={{ textAlign: "center", padding: "30px", color: "var(--text-secondary)" }}>
                                        No recent appointments booked.
                                    </td>
                                </tr>
                            ) : (
                                dashData.latestAppointments.map((item, index) => (
                                    <tr key={item._id || index}>
                                        <td>{index + 1}</td>
                                        <td>
                                            <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                                                <img 
                                                    src={item.userData.image || "https://via.placeholder.com/32"} 
                                                    alt="" 
                                                    style={{ width: "32px", height: "32px", borderRadius: "50%", objectFit: "cover" }} 
                                                />
                                                <span style={{ fontWeight: "500" }}>{item.userData.name}</span>
                                            </div>
                                        </td>
                                        <td>
                                            <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                                                <img 
                                                    src={item.docData.image || "https://via.placeholder.com/32"} 
                                                    alt="" 
                                                    style={{ width: "32px", height: "32px", borderRadius: "50%", objectFit: "cover" }} 
                                                />
                                                <span>{item.docData.name}</span>
                                            </div>
                                        </td>
                                        <td>
                                            <div style={{ fontWeight: "500" }}>{slotDateFormat(item.slotDate)}</div>
                                            <div style={{ fontSize: "12px", color: "var(--text-secondary)" }}>{item.slotTime}</div>
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
