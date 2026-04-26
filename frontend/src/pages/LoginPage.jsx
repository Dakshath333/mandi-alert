import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import PageWrapper from '../components/PageWrapper'
import { loginFarmer } from '../utils/api'

export default function LoginPage() {
  const navigate = useNavigate()
  const [phone, setPhone] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!/^\d{10}$/.test(phone)) { setError('Enter a valid 10-digit mobile number.'); return }
    setLoading(true); setError('')
    try {
      const res = await loginFarmer({ phone })
      localStorage.setItem('farmer', JSON.stringify(res.data.data))
      navigate('/dashboard')
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed. Please try again.')
    } finally { setLoading(false) }
  }

  return (
    <PageWrapper className="min-h-[80vh] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-sm">
        <motion.div initial={{ opacity:0, y:-16 }} animate={{ opacity:1, y:0 }} className="text-center mb-8">
          <span className="text-5xl block mb-3">🔐</span>
          <h1 className="font-display text-2xl font-bold text-gray-900">Welcome back</h1>
          <p className="text-gray-500 text-sm mt-1">Login with your registered mobile number</p>
        </motion.div>

        <motion.div initial={{ opacity:0, y:16 }} animate={{ opacity:1, y:0 }} transition={{ delay:0.1 }}
          className="card">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="label">Mobile Number</label>
              <div className="flex">
                <span className="border border-r-0 border-gray-200 rounded-l-xl bg-gray-50 px-3 py-2.5 text-sm text-gray-500 flex-shrink-0">
                  +91
                </span>
                <input type="tel" value={phone} maxLength={10} autoFocus
                  onChange={e => { setPhone(e.target.value); setError('') }}
                  placeholder="10-digit number"
                  className="input-field rounded-l-none border-l-0" />
              </div>
            </div>
            {error && (
              <motion.div initial={{ opacity:0 }} animate={{ opacity:1 }}
                className="bg-red-50 border border-red-200 text-red-600 text-xs p-3 rounded-lg">
                ⚠️ {error}
              </motion.div>
            )}
            <motion.button type="submit" disabled={loading} whileTap={{ scale:0.97 }}
              className="btn-primary w-full disabled:opacity-60 justify-center text-center">
              {loading ? 'Verifying…' : 'Login →'}
            </motion.button>
          </form>
          <p className="text-center text-xs text-gray-400 mt-4">
            Not registered yet?{' '}
            <Link to="/register" className="text-green-600 font-semibold hover:underline">
              Register here
            </Link>
          </p>
        </motion.div>
      </div>
    </PageWrapper>
  )
}
