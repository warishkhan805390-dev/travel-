import { Navigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import Loader from '../common/Loader'

export default function AdminRoute({ children }) {
  const { user, loading } = useAuth()

  if (loading) return <Loader type="page" />

  if (!user || user.role !== 'admin') {
    return <Navigate to="/" replace />
  }

  return children
}
