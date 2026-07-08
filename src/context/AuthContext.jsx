import { createContext, useContext, useState, useEffect } from 'react'
import axios from 'axios'
import toast from 'react-hot-toast'

const AuthContext = createContext()

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [token, setToken] = useState(localStorage.getItem('token'))

  useEffect(() => {
    if (token) {
      loadUser()
    } else {
      setLoading(false)
    }
  }, [token])

  const loadUser = async () => {
    try {
      const config = { headers: { Authorization: `Bearer ${token}` } }
      const { data } = await axios.get('/api/auth/me', config)
      setUser(data.data)
    } catch (error) {
      localStorage.removeItem('token')
      setToken(null)
      setUser(null)
    } finally {
      setLoading(false)
    }
  }

  const login = async (email, password) => {
    try {
      const { data } = await axios.post('/api/auth/login', { email, password })
      localStorage.setItem('token', data.token)
      setToken(data.token)
      setUser(data.user)
      toast.success('Welcome back!')
      return data
    } catch (error) {
      toast.error(error.response?.data?.message || 'Login failed')
      throw error
    }
  }

  const register = async (formData) => {
    try {
      const { data } = await axios.post('/api/auth/register', formData)
      localStorage.setItem('token', data.token)
      setToken(data.token)
      setUser(data.user)
      toast.success('Account created successfully!')
      return data
    } catch (error) {
      toast.error(error.response?.data?.message || 'Registration failed')
      throw error
    }
  }

  const logout = () => {
    localStorage.removeItem('token')
    setToken(null)
    setUser(null)
    toast.success('Logged out successfully')
  }

  const updateProfile = async (formData) => {
    try {
      const config = { headers: { Authorization: `Bearer ${token}` } }
      const { data } = await axios.put('/api/auth/updatedetails', formData, config)
      setUser(data.data)
      toast.success('Profile updated')
      return data
    } catch (error) {
      toast.error(error.response?.data?.message || 'Update failed')
      throw error
    }
  }

  return (
    <AuthContext.Provider value={{
      user, loading, token,
      login, register, logout, updateProfile, loadUser
    }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)
