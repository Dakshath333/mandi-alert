import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import PageWrapper from '../components/PageWrapper'
import StatCard from '../components/StatCard'
import LoadingSpinner from '../components/LoadingSpinner'
import { getAdminStats, getFarmers, triggerAlerts, addMarketPrice } from '../utils/api'

export default function AdminPage() {
  const [stats, setStats] = useState(null)
  const [farmers, setFarmers] = useState([])
  const [loading, setLoading] = useState(true)
  const [triggering, setTriggering] = useState(false)
  const [triggerResult, setTriggerResult] = useState(null)
  const [activeTab, setActiveTab] = useState('overview')

  // Add price form
  const [priceForm, setPriceForm] = useState({ crop: '', mandi: '', location: '', price: '' })
  const [priceMsg, setPriceMsg] = useState('')

  useEffect(() => {
    fetchAll()
  }, [])

  const fetchAll = async () => {
    setLoading(true)
    try {
      const [statsRes, farmersRes] = await Promise.all([
        getAdminStats(),
        getFarmers(),
      ])
      setStats(statsRes.data.data)
      setFarmers(farmersRes.data.data)
    } catch {
      // backend not running
    } finally {
      setLoading(false)
    }
  }

  const handleTrigger = async () => {
    setTriggering(true)
    setTriggerResult(null)
    try {
      const res = await triggerAlerts()
      setTriggerResult(res.data)
      fetchAll()
    } catch (err) {
      setTriggerResult({ error: 'Failed to trigger alerts.' })
    } finally {
      setTriggering(false)
    }
  }

  const handleAddPrice = async (e) => {
    e.preventDefault()
    try {
      await addMarketPrice({
        ...priceForm,
        price: Number(priceForm.price),
      })
      setPriceMsg('✅ Price added successfully!')
      setPriceForm({ crop: '', mandi: '', location: '', price: '' })
      fetchAll()
    } catch {
      setPriceMsg('❌ Failed to add price.')
    }
  }

  return (
    <PageWrapper className="max-w-6xl mx-auto px-4 py-10">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: -15 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
        <h1 className="font-display text-3xl font-bold text-gray-900">Admin Panel</h1>
        <p className="text-gray-500 mt-1">Monitor farmers, prices, and send alerts</p>
      </motion.div>

      {/* Tabs */}
      <div className="flex gap-2 mb-8 border-b border-green-100 pb-2">
        {['overview', 'farmers', 'prices'].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2 text-sm font-medium rounded-t-lg capitalize transition-all ${
              activeTab === tab
                ? 'bg-green-600 text-white'
                : 'text-gray-600 hover:text-green-700 hover:bg-green-50'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {loading ? (
        <LoadingSpinner message="Loading admin data…" />
      ) : (
        <>
          {/* ─── OVERVIEW TAB ─── */}
          {activeTab === 'overview' && (
            <div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                <StatCard icon="🧑‍🌾" label="Total Farmers" value={stats?.totalFarmers ?? 0} color="green" delay={0} />
                <StatCard icon="🏪" label="Total Mandis" value={stats?.totalMarkets ?? 0} color="blue" delay={0.05} />
                <StatCard icon="📱" label="Alerts Sent" value={stats?.totalAlerts ?? 0} color="amber" delay={0.1} />
                <StatCard icon="🌿" label="Top Crop" value={stats?.topCrops?.[0]?._id ?? '—'} color="rose" delay={0.15} />
              </div>

              {/* Alert Trigger */}
              <div className="card mb-6">
                <h2 className="font-semibold text-gray-800 mb-2">📣 Trigger Price Alerts</h2>
                <p className="text-sm text-gray-500 mb-4">
                  Manually trigger the alert system to check all mandis and SMS farmers with better prices.
                </p>
                <motion.button
                  whileTap={{ scale: 0.97 }}
                  onClick={handleTrigger}
                  disabled={triggering}
                  className="btn-primary disabled:opacity-60"
                >
                  {triggering ? '⏳ Sending Alerts…' : '🚀 Send Alerts Now'}
                </motion.button>

                {triggerResult && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mt-4 bg-green-50 border border-green-200 rounded-xl p-4"
                  >
                    <p className="font-semibold text-green-700 mb-2">{triggerResult.message}</p>
                    {triggerResult.results?.map((r, i) => (
                      <div key={i} className="text-sm text-gray-600 flex items-center gap-2 mb-1">
                        <span>{r.status === 'sent' ? '✅' : '📋'}</span>
                        <span>{r.farmer} ({r.phone}) — {r.status}</span>
                      </div>
                    ))}
                  </motion.div>
                )}
              </div>

              {/* Top Crops */}
              {stats?.topCrops?.length > 0 && (
                <div className="card">
                  <h2 className="font-semibold text-gray-800 mb-4">🌱 Popular Crops</h2>
                  <div className="space-y-2">
                    {stats.topCrops.map((c, i) => (
                      <div key={i} className="flex items-center justify-between text-sm">
                        <span className="text-gray-700">{c._id}</span>
                        <span className="font-semibold text-green-700">{c.count} farmers</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* ─── FARMERS TAB ─── */}
          {activeTab === 'farmers' && (
            <div className="card overflow-x-auto">
              <h2 className="font-semibold text-gray-800 mb-4">🧑‍🌾 Registered Farmers ({farmers.length})</h2>
              {farmers.length === 0 ? (
                <p className="text-gray-400 text-center py-8">No farmers registered yet.</p>
              ) : (
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-gray-100 text-left text-gray-500">
                      <th className="pb-3 pr-4">Name</th>
                      <th className="pb-3 pr-4">Phone</th>
                      <th className="pb-3 pr-4">Crop</th>
                      <th className="pb-3 pr-4">Location</th>
                      <th className="pb-3">Registered</th>
                    </tr>
                  </thead>
                  <tbody>
                    {farmers.map((f, i) => (
                      <motion.tr
                        key={f._id}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: i * 0.03 }}
                        className="border-b border-gray-50 hover:bg-green-50 transition-colors"
                      >
                        <td className="py-3 pr-4 font-medium text-gray-900">{f.name}</td>
                        <td className="py-3 pr-4 text-gray-600">{f.phone}</td>
                        <td className="py-3 pr-4">
                          <span className="bg-green-100 text-green-700 text-xs font-medium px-2 py-0.5 rounded-full">
                            {f.crop}
                          </span>
                        </td>
                        <td className="py-3 pr-4 text-gray-600">{f.location}</td>
                        <td className="py-3 text-gray-400">
                          {new Date(f.createdAt).toLocaleDateString('en-IN')}
                        </td>
                      </motion.tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          )}

          {/* ─── PRICES TAB ─── */}
          {activeTab === 'prices' && (
            <div className="card max-w-xl">
              <h2 className="font-semibold text-gray-800 mb-4">➕ Add Market Price</h2>
              <form onSubmit={handleAddPrice} className="space-y-4">
                <div>
                  <label className="label">Crop Name</label>
                  <input
                    className="input-field"
                    placeholder="e.g. Tomato"
                    value={priceForm.crop}
                    onChange={(e) => setPriceForm(p => ({ ...p, crop: e.target.value }))}
                    required
                  />
                </div>
                <div>
                  <label className="label">Mandi Name</label>
                  <input
                    className="input-field"
                    placeholder="e.g. Mysore Mandi"
                    value={priceForm.mandi}
                    onChange={(e) => setPriceForm(p => ({ ...p, mandi: e.target.value }))}
                    required
                  />
                </div>
                <div>
                  <label className="label">Location / District</label>
                  <input
                    className="input-field"
                    placeholder="e.g. Mysore"
                    value={priceForm.location}
                    onChange={(e) => setPriceForm(p => ({ ...p, location: e.target.value }))}
                    required
                  />
                </div>
                <div>
                  <label className="label">Price (₹ per quintal)</label>
                  <input
                    type="number"
                    className="input-field"
                    placeholder="e.g. 2800"
                    value={priceForm.price}
                    onChange={(e) => setPriceForm(p => ({ ...p, price: e.target.value }))}
                    min="0"
                    required
                  />
                </div>

                {priceMsg && (
                  <p className="text-sm font-medium text-green-700 bg-green-50 p-3 rounded-lg">
                    {priceMsg}
                  </p>
                )}

                <button type="submit" className="btn-primary w-full">
                  Add Price Entry
                </button>
              </form>
            </div>
          )}
        </>
      )}
    </PageWrapper>
  )
}
