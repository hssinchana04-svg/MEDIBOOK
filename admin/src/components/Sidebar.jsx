import React, { useContext } from "react"
import { NavLink } from "react-router-dom"
import { AdminContext } from "../context/AdminContext"
import { DoctorContext } from "../context/DoctorContext"

const Sidebar = () => {
    const { aToken } = useContext(AdminContext)
    const { dToken } = useContext(DoctorContext)

    return (
        <aside className="portal-sidebar">
            {aToken && (
                <>
                    <NavLink to="/admin-dashboard" className={({ active }) => `sidebar-link ${active ? "active" : ""}`}>
                        <svg viewBox="0 0 24 24">
                            <rect x="3" y="3" width="7" height="9" rx="1"></rect>
                            <rect x="14" y="3" width="7" height="5" rx="1"></rect>
                            <rect x="14" y="12" width="7" height="9" rx="1"></rect>
                            <rect x="3" y="16" width="7" height="5" rx="1"></rect>
                        </svg>
                        <span>Dashboard</span>
                    </NavLink>

                    <NavLink to="/all-appointments" className={({ active }) => `sidebar-link ${active ? "active" : ""}`}>
                        <svg viewBox="0 0 24 24">
                            <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                            <line x1="16" y1="2" x2="16" y2="6"></line>
                            <line x1="8" y1="2" x2="8" y2="6"></line>
                            <line x1="3" y1="10" x2="21" y2="10"></line>
                        </svg>
                        <span>Appointments</span>
                    </NavLink>

                    <NavLink to="/add-doctor" className={({ active }) => `sidebar-link ${active ? "active" : ""}`}>
                        <svg viewBox="0 0 24 24">
                            <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                            <circle cx="8.5" cy="7" r="4"></circle>
                            <line x1="20" y1="8" x2="20" y2="14"></line>
                            <line x1="23" y1="11" x2="17" y2="11"></line>
                        </svg>
                        <span>Add Doctor</span>
                    </NavLink>

                    <NavLink to="/doctor-list" className={({ active }) => `sidebar-link ${active ? "active" : ""}`}>
                        <svg viewBox="0 0 24 24">
                            <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                            <circle cx="9" cy="7" r="4"></circle>
                            <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
                            <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
                        </svg>
                        <span>Doctors List</span>
                    </NavLink>
                </>
            )}

            {dToken && (
                <>
                    <NavLink to="/doctor-dashboard" className={({ active }) => `sidebar-link ${active ? "active" : ""}`}>
                        <svg viewBox="0 0 24 24">
                            <rect x="3" y="3" width="7" height="9" rx="1"></rect>
                            <rect x="14" y="3" width="7" height="5" rx="1"></rect>
                            <rect x="14" y="12" width="7" height="9" rx="1"></rect>
                            <rect x="3" y="16" width="7" height="5" rx="1"></rect>
                        </svg>
                        <span>Dashboard</span>
                    </NavLink>

                    <NavLink to="/doctor-appointments" className={({ active }) => `sidebar-link ${active ? "active" : ""}`}>
                        <svg viewBox="0 0 24 24">
                            <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                            <line x1="16" y1="2" x2="16" y2="6"></line>
                            <line x1="8" y1="2" x2="8" y2="6"></line>
                            <line x1="3" y1="10" x2="21" y2="10"></line>
                        </svg>
                        <span>Appointments</span>
                    </NavLink>

                    <NavLink to="/doctor-profile" className={({ active }) => `sidebar-link ${active ? "active" : ""}`}>
                        <svg viewBox="0 0 24 24">
                            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                            <circle cx="12" cy="7" r="4"></circle>
                        </svg>
                        <span>Profile</span>
                    </NavLink>
                </>
            )}
        </aside>
    )
}

export default Sidebar
