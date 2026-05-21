import React, { useContext } from "react"
import { AdminContext } from "../context/AdminContext"
import { DoctorContext } from "../context/DoctorContext"
import { useNavigate } from "react-router-dom"
import { toast } from "react-toastify"

const Header = () => {
    const { aToken, setAToken } = useContext(AdminContext)
    const { dToken, setDToken } = useContext(DoctorContext)
    const navigate = useNavigate()

    const logout = () => {
        navigate("/")
        if (aToken) {
            setAToken("")
            localStorage.removeItem("aToken")
            toast.success("Admin logged out successfully")
        } else if (dToken) {
            setDToken("")
            localStorage.removeItem("dToken")
            toast.success("Doctor logged out successfully")
        }
    }

    return (
        <header className="portal-header">
            <div className="header-brand" onClick={() => navigate("/")}>
                Medi<span>book</span>
            </div>

            <div className="header-meta">
                <span className="role-badge">
                    {aToken ? "Admin Panel" : "Doctor Panel"}
                </span>
                <button onClick={logout} className="logout-btn">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
                        <polyline points="16 17 21 12 16 7"></polyline>
                        <line x1="21" y1="12" x2="9" y2="12"></line>
                    </svg>
                    Logout
                </button>
            </div>
        </header>
    )
}

export default Header
