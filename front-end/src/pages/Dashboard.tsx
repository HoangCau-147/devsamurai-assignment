import { useNavigate } from 'react-router-dom'
import { logout } from '../lib/auth'

export default function Dashboard() {
  const navigate = useNavigate()

  function handleLogout() {
    logout()
    navigate('/login')
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl mb-4">Dashboard</h1>
      <p className="mb-4">You are logged in.</p>
      <button onClick={handleLogout} className="px-4 py-2 bg-gray-700 text-white rounded">
        Log out
      </button>
    </div>
  )
}