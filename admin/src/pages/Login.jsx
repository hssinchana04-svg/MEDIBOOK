import React, { useContext, useState } from "react"
import { AdminContext } from "../context/AdminContext"
import { DoctorContext } from "../context/DoctorContext"
import axios from "axios"
import { toast } from "react-toastify"

const Login = () => {
    const [state, setState] = useState("Admin") // "Admin" or "Doctor"
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")

    const { setAToken, backendUrl } = useContext(AdminContext)
    const { setDToken } = useContext(DoctorContext)

    const onSubmitHandler = async (event) => {
        event.preventDefault()
        try {
            if (state === "Admin") {
                const { data } = await axios.post(`${backendUrl}/api/admin/login`, { email, password })
                if (data.success) {
                    localStorage.setItem("aToken", data.token)
                    setAToken(data.token)
                    toast.success("Admin logged in successfully!")
                } else {
                    toast.error(data.message)
                }
            } else {
                const { data } = await axios.post(`${backendUrl}/api/doctor/login`, { email, password })
                if (data.success) {
                    localStorage.setItem("dToken", data.token)
                    setDToken(data.token)
                    toast.success("Doctor logged in successfully!")
                } else {
                    toast.error(data.message)
                }
            }
        } catch (error) {
            toast.error(error.message)
        }
    }

    return (
        <div className="login-screen">
            <div className="login-card">
                <div className="login-card-header">
                    <div className="login-logo">
                        Medi<span>book</span>
                    </div>
                    <div className="login-subtitle">
                        {state === "Admin" ? "Administrator Portal" : "Doctor Portal"}
                    </div>
                </div>

                <div className="login-role-selector">
                    <button 
                        type="button"
                        onClick={() => { setState("Admin"); setEmail(""); setPassword(""); }} 
                        className={`login-role-btn ${state === "Admin" ? "active" : ""}`}
                    >
                        Admin
                    </button>
                    <button 
                        type="button"
                        onClick={() => { setState("Doctor"); setEmail(""); setPassword(""); }} 
                        className={`login-role-btn ${state === "Doctor" ? "active" : ""}`}
                    >
                        Doctor
                    </button>
                </div>

                <form onSubmit={onSubmitHandler} className="login-form">
                    <div className="form-group">
                        <label className="form-label" htmlFor="email-input">Email Address</label>
                        <input 
                            id="email-input"
                            type="email" 
                            className="form-input" 
                            placeholder="name@medibook.com" 
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label className="form-label" htmlFor="password-input">Password</label>
                        <input 
                            id="password-input"
                            type="password" 
                            className="form-input" 
                            placeholder="••••••••" 
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>
                    <button type="submit" className="btn-primary" style={{ width: "100%", marginTop: "10px" }}>
                        Sign In
                    </button>
                </form>
            </div>
        </div>
    )
}

export default Login
