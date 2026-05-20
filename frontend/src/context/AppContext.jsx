import { createContext, useEffect, useState } from "react"
import axios from "axios"
import { toast } from "react-toastify"

export const AppContext = createContext()

const AppContextProvider = ({ children }) => {

    const backendUrl = import.meta.env.VITE_BACKEND_URL
    const [token, setToken] = useState(localStorage.getItem('token') || "")
    const [userData, setUserData] = useState(null)
    const [doctors, setDoctors] = useState([])

    const getDoctors = async () => {
        try {
            const { data } = await axios.get(`${backendUrl}/api/doctor/list`)
            if (data.success) setDoctors(data.doctors)
            else toast.error(data.message)
        } catch (error) {
            toast.error(error.message)
        }
    }

    const loadUserProfileData = async () => {
        try {
            const { data } = await axios.get(`${backendUrl}/api/user/profile`, {
                headers: { token }
            })
            if (data.success) {
                setUserData(data.userData)
            } else {
                toast.error(data.message)
                setToken("")
                localStorage.removeItem("token")
            }
        } catch (error) {
            toast.error(error.message)
            setToken("")
            localStorage.removeItem("token")
        }
    }

    useEffect(() => {
        getDoctors()
    }, [])

    useEffect(() => {
        if (token) loadUserProfileData()
        else setUserData(null)
    }, [token])

    const value = {
        backendUrl,
        token, setToken,
        userData, setUserData,
        doctors, getDoctors
    }

    return (
        <AppContext.Provider value={value}>
            {children}
        </AppContext.Provider>
    )
}

export default AppContextProvider