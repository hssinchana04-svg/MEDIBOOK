import React, { useContext, useEffect } from "react"
import { DoctorContext } from "../../context/DoctorContext"
import { AppContext } from "../../context/AppContext"

const Appointments = () => {
    const { dToken, appointments, getAppointments, completeAppointment, cancelAppointment } = useContext(DoctorContext)
    const { slotDateFormat, calculateAge, currency } = useContext(AppContext)

    useEffect(() => {
        if (dToken) {
            getAppointments()
        }
    }, [dToken])

    return (
        <div>
            <div className="page-title-section">
                <h1 className="page-title">My Appointments</h1>
                <p className="page-subtitle">Roster of all patient appointments booked with you. Manage session updates, completions, and cancellations.</p>
            </div>

            <div className="panel-card">
                <div className="panel-card-header">
                    <h2 className="panel-card-title">Bookings Log ({appointments.length})</h2>
                </div>
                <div className="table-responsive">
                    <table className="premium-table">
                        <thead>
                            <tr>
                                <th>#</th>
                                <th>Patient Name</th>
                                <th>Age</th>
                                <th>Session Date & Time</th>
                                <th>Clinical Symptoms / Notes</th>
                                <th>Payment</th>
                                <th>Fee</th>
                                <th>Status</th>
                                <th style={{ textAlign: "right" }}>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {appointments.length === 0 ? (
                                <tr>
                                    <td colSpan="9" style={{ textAlign: "center", padding: "40px", color: "var(--text-secondary)" }}>
                                        No appointments scheduled with you yet.
                                    </td>
                                </tr>
                            ) : (
                                [...appointments].reverse().map((item, index) => (
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
                                                            For: {item.patientDetails.name}
                                                        </span>
                                                    )}
                                                </div>
                                            </div>
                                        </td>
                                        <td>
                                            {item.userData.dob ? calculateAge(item.userData.dob) : "N/A"}
                                        </td>
                                        <td>
                                            <div style={{ fontWeight: "500" }}>{slotDateFormat(item.slotDate)}</div>
                                            <div style={{ fontSize: "12px", color: "var(--text-secondary)" }}>{item.slotTime}</div>
                                        </td>
                                        <td>
                                            {item.patientDetails?.symptoms ? (
                                                <div style={{ maxWidth: "220px", fontSize: "13px", color: "var(--text-secondary)" }}>
                                                    <strong>Symptoms:</strong> {item.patientDetails.symptoms}
                                                    {item.patientDetails.weight && ` | Wt: ${item.patientDetails.weight} kg`}
                                                </div>
                                            ) : (
                                                <span style={{ color: "var(--text-muted)", fontSize: "13px" }}>No custom symptoms noted</span>
                                            )}
                                        </td>
                                        <td>
                                            <span className={`status-pill ${item.payment ? "active" : "pending"}`}>
                                                {item.payment ? "Paid" : "Pending"}
                                            </span>
                                        </td>
                                        <td>
                                            <span style={{ fontWeight: "600" }}>{currency}{item.amount}</span>
                                        </td>
                                        <td>
                                            {item.cancelled ? (
                                                <span className="status-pill cancelled">Cancelled</span>
                                            ) : item.isCompleted ? (
                                                <span className="status-pill completed">Completed</span>
                                            ) : (
                                                <span className="status-pill active">Active</span>
                                            )}
                                        </td>
                                        <td style={{ textAlign: "right" }}>
                                            {!item.cancelled && !item.isCompleted && (
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

export default Appointments
