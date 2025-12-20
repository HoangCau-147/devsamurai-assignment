import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { isAuthenticated, login } from '../lib/auth'

export default function AuthPage() {
  const navigate = useNavigate()

  useEffect(() => {
    if (isAuthenticated()) {
      navigate('/')
    }
  }, [navigate])

  function handleLogin() {
    // Replace with real login flow: call API, get token
    login('demo-token')
    navigate('/')
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl mb-4">Login</h1>
      <p className="mb-4">Click to simulate login (demo token)</p>
      <button onClick={handleLogin} className="px-4 py-2 bg-blue-600 text-white rounded">
        Log in
      </button>
    </div>
  )
}