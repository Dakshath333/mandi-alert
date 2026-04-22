import { useState } from 'react'
import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import PageWrapper from '../components/PageWrapper'
import { registerFarmer } from '../utils/api'

const CROPS = [
  'Tomato', 'Onion', 'Potato', 'Rice', 'Maize',
  'Sugarcane', 'Ragi', 'Groundnut', 'Wheat', 'Banana', 'Mango',
]

const LOCATIONS = [
  'Bangalore', 'Mysore', 'Hubli', 'Shivamogga', 'Davangere',
  'Hassan', 'Mandya', 'Tumkur', 'Chitradurga', 'Bellary',
]

export default function RegisterPage() {
  const navigate = useNavigate()
  const [form, setForm] = useState({ name: '', phone: '', crop: '', location: '' })
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState('')

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }))
    setError('')
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!form.name || !form.phone || !form.crop || !form.location) {
      setError('Please fill in all fields.')
      return
    }
    if (!/^\d{10}$/.test(form.phone)) {
      setError('Enter a valid 10-digit phone number.')
      return
    }

    setLoading(true)
    try {
      await registerFarmer(form)
      setSuccess(true)
      setTimeout(() => navigate('/dashboard'), 2000)
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <PageWrapper className="min-h-screen bg-green-50 flex items-center justify-center px-4 py-16">
      <div className="w-full max-w-md">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <span className="text-5xl mb-3 block">🧑‍🌾</span>
          <h1 className="font-display text-3xl font-bold text-gray-900">Join MandiAlert</h1>
          <p className="text-gray-500 mt-2">Register once — get price alerts for life.</p>
        </motion.div>

        {/* Success State */}
        {success ? (
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="card text-center py-12"
          >
            <span className="text-6xl block mb-4">✅</span>
            <h2 className="text-xl font-bold text-green-700 mb-2">Registration Successful!</h2>
            <p className="text-gray-500">Redirecting you to the dashboard…</p>
          </motion.div>
        ) : (
          <motion.form
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            onSubmit={handleSubmit}
            className="card space-y-5"
          >
            {/* Name */}
            <div>
              <label className="label">Your Full Name</label>
              <input
                type="text"
                name="name"
                value={form.name}
                onChange={handleChange}
                placeholder="e.g. Raju Patil"
                className="input-field"
              />
            </div>

            {/* Phone */}
            <div>
              <label className="label">Mobile Number</label>
              <div className="flex gap-2">
                <span className="input-field w-16 text-center text-gray-500 bg-gray-50 flex-shrink-0">+91</span>
                <input
                  type="tel"
                  name="phone"
                  value={form.phone}
                  onChange={handleChange}
                  placeholder="10-digit number"
                  maxLength={10}
                  className="input-field"
                />
              </div>
            </div>

            {/* Crop */}
            <div>
              <label className="label">Your Main Crop</label>
              <select name="crop" value={form.crop} onChange={handleChange} className="input-field">
                <option value="">Select a crop…</option>
                {CROPS.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>

            {/* Location */}
            <div>
              <label className="label">Your Location / District</label>
              <select name="location" value={form.location} onChange={handleChange} className="input-field">
                <option value="">Select your district…</option>
                {LOCATIONS.map((l) => (
                  <option key={l} value={l}>{l}</option>
                ))}
              </select>
            </div>

            {/* Error message */}
            {error && (
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-red-500 text-sm bg-red-50 p-3 rounded-lg"
              >
                ⚠️ {error}
              </motion.p>
            )}

            {/* Submit */}
            <motion.button
              type="submit"
              disabled={loading}
              whileHover={{ scale: loading ? 1 : 1.02 }}
              whileTap={{ scale: loading ? 1 : 0.97 }}
              className="btn-primary w-full text-center disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {loading ? '⏳ Registering…' : 'Register & Get Alerts →'}
            </motion.button>

            <p className="text-xs text-gray-400 text-center">
              No spam. Only price alerts for your crop.
            </p>
          </motion.form>
        )}
      </div>
    </PageWrapper>
  )
}
