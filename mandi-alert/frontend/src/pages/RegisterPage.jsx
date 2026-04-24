import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import PageWrapper from '../components/PageWrapper'
import { registerFarmer } from '../utils/api'

const CROPS = ['Tomato','Onion','Potato','Rice','Maize','Sugarcane','Ragi','Groundnut','Wheat','Banana','Mango','Chilli','Cotton','Brinjal','Cabbage']
const DISTRICTS = ['Bangalore','Mysore','Hubli-Dharwad','Shivamogga','Davangere','Hassan','Mandya','Tumkur','Chitradurga','Bellary','Nashik','Pune','Guntur','Kurnool','Coimbatore']

export default function RegisterPage() {
  const navigate = useNavigate()
  const [form, setForm] = useState({ name:'', phone:'', crop:'', location:'' })
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState('')

  const handleChange = e => { setForm(p => ({...p,[e.target.name]:e.target.value})); setError('') }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!form.name.trim()||!form.phone||!form.crop||!form.location) {
      setError('All fields are required.'); return
    }
    if (!/^\d{10}$/.test(form.phone)) { setError('Enter a valid 10-digit mobile number.'); return }
    setLoading(true)
    try {
      const res = await registerFarmer(form)
      localStorage.setItem('farmer', JSON.stringify(res.data.data))
      setSuccess(true)
      setTimeout(() => navigate('/dashboard'), 2200)
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed. Please try again.')
    } finally { setLoading(false) }
  }

  return (
    <PageWrapper className="min-h-[80vh] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        <motion.div initial={{ opacity:0, y:-16 }} animate={{ opacity:1, y:0 }} className="text-center mb-8">
          <span className="text-5xl block mb-3">🧑‍🌾</span>
          <h1 className="font-display text-2xl font-bold text-gray-900">Create your account</h1>
          <p className="text-gray-500 text-sm mt-1">Register once to get SMS price alerts for life</p>
        </motion.div>

        {success ? (
          <motion.div initial={{ scale:0.9 }} animate={{ scale:1 }} className="card text-center py-12">
            <span className="text-6xl block mb-4">✅</span>
            <h2 className="font-bold text-lg text-green-700 mb-1">Registration Successful!</h2>
            <p className="text-gray-400 text-sm">Taking you to your dashboard…</p>
          </motion.div>
        ) : (
          <motion.form initial={{ opacity:0, y:16 }} animate={{ opacity:1, y:0 }} transition={{ delay:0.1 }}
            onSubmit={handleSubmit} className="card space-y-4">
            <div>
              <label className="label">Full Name</label>
              <input name="name" value={form.name} onChange={handleChange}
                placeholder="e.g. Raju Patil" className="input-field" autoFocus />
            </div>
            <div>
              <label className="label">Mobile Number</label>
              <div className="flex">
                <span className="border border-r-0 border-gray-200 rounded-l-xl bg-gray-50 px-3 py-2.5 text-sm text-gray-500 flex-shrink-0">+91</span>
                <input name="phone" type="tel" value={form.phone} onChange={handleChange}
                  placeholder="10-digit number" maxLength={10} className="input-field rounded-l-none border-l-0" />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="label">Primary Crop</label>
                <select name="crop" value={form.crop} onChange={handleChange} className="select-field">
                  <option value="">Select crop…</option>
                  {CROPS.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
              <div>
                <label className="label">Your District</label>
                <select name="location" value={form.location} onChange={handleChange} className="select-field">
                  <option value="">Select district…</option>
                  {DISTRICTS.map(d => <option key={d} value={d}>{d}</option>)}
                </select>
              </div>
            </div>
            {error && (
              <motion.div initial={{ opacity:0 }} animate={{ opacity:1 }}
                className="bg-red-50 border border-red-200 text-red-600 text-xs p-3 rounded-lg">
                ⚠️ {error}
              </motion.div>
            )}
            <motion.button type="submit" disabled={loading} whileTap={{ scale:0.97 }}
              className="btn-primary w-full text-center disabled:opacity-60">
              {loading ? 'Registering…' : 'Create Account →'}
            </motion.button>
            <p className="text-center text-xs text-gray-400">
              Already registered?{' '}
              <Link to="/login" className="text-green-600 font-semibold hover:underline">Login here</Link>
            </p>
          </motion.form>
        )}
      </div>
    </PageWrapper>
  )
}
