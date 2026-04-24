import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid,
} from 'recharts'
import PageWrapper from '../components/PageWrapper'
import PriceCard from '../components/PriceCard'
import AlertBadge from '../components/AlertBadge'
import LoadingSpinner from '../components/LoadingSpinner'
import { getMarketPrices, comparePrices, getAlerts, seedSampleData } from '../utils/api'

const CROPS = ['Tomato', 'Onion', 'Potato', 'Rice', 'Maize', 'Groundnut', 'Ragi']

export default function DashboardPage() {
  const [prices, setPrices] = useState([])
  const [alerts, setAlerts] = useState([])
  const [selectedCrop, setSelectedCrop] = useState('Tomato')
  const [compareData, setCompareData] = useState([])
  const [loading, setLoading] = useState(true)
  const [seeding, setSeeding] = useState(false)

  // Fetch all prices and alerts on load
  useEffect(() => {
    fetchData()
  }, [])

  // Fetch comparison when crop changes
  useEffect(() => {
    fetchCompare()
  }, [selectedCrop])

  const fetchData = async () => {
    setLoading(true)
    try {
      const [priceRes, alertRes] = await Promise.all([
        getMarketPrices(),
        getAlerts(),
      ])
      setPrices(priceRes.data.data)
      setAlerts(alertRes.data.data)
    } catch {
      // Backend may not be running; show empty state
    } finally {
      setLoading(false)
    }
  }

  const fetchCompare = async () => {
    try {
      const res = await comparePrices(selectedCrop)
      setCompareData(res.data.allMandis || [])
    } catch {
      setCompareData([])
    }
  }

  const handleSeed = async () => {
    setSeeding(true)
    try {
      await seedSampleData()
      await fetchData()
      await fetchCompare()
    } finally {
      setSeeding(false)
    }
  }

  // Get top 3 best prices (unique mandi)
  const topPrices = [...prices]
    .sort((a, b) => b.price - a.price)
    .slice(0, 6)

  return (
    <PageWrapper className="max-w-6xl mx-auto px-4 py-10">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -15 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8"
      >
        <div>
          <h1 className="font-display text-3xl font-bold text-gray-900">Farmer Dashboard</h1>
          <p className="text-gray-500 mt-1">Live mandi prices & your recent alerts</p>
        </div>
        <button
          onClick={handleSeed}
          disabled={seeding}
          className="btn-secondary text-sm"
        >
          {seeding ? '⏳ Loading…' : '🌱 Load Sample Data'}
        </button>
      </motion.div>

      {loading ? (
        <LoadingSpinner message="Fetching mandi prices…" />
      ) : (
        <>
          {/* Best Price Cards */}
          <section className="mb-10">
            <h2 className="font-semibold text-gray-700 mb-4 text-lg">📍 Best Prices Today</h2>
            {topPrices.length === 0 ? (
              <div className="card text-center py-10 text-gray-400">
                <p className="text-4xl mb-3">📭</p>
                <p>No prices yet. Click "Load Sample Data" to get started.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {topPrices.map((p, i) => (
                  <PriceCard key={p._id} {...p} isBest={i === 0} delay={i * 0.05} />
                ))}
              </div>
            )}
          </section>

          {/* Price Comparison Chart */}
          <section className="mb-10">
            <div className="card">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
                <h2 className="font-semibold text-gray-700 text-lg">📊 Compare Mandis</h2>
                <div className="flex flex-wrap gap-2">
                  {CROPS.map((c) => (
                    <button
                      key={c}
                      onClick={() => setSelectedCrop(c)}
                      className={`px-3 py-1 text-sm rounded-lg font-medium transition-all duration-150 ${
                        selectedCrop === c
                          ? 'bg-green-600 text-white'
                          : 'bg-green-50 text-green-700 hover:bg-green-100'
                      }`}
                    >
                      {c}
                    </button>
                  ))}
                </div>
              </div>

              {compareData.length === 0 ? (
                <p className="text-center text-gray-400 py-8">No data for {selectedCrop} yet.</p>
              ) : (
                <ResponsiveContainer width="100%" height={260}>
                  <BarChart data={compareData} margin={{ top: 5, right: 10, left: 0, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0fdf4" />
                    <XAxis dataKey="mandi" tick={{ fontSize: 12 }} />
                    <YAxis tick={{ fontSize: 12 }} tickFormatter={(v) => `₹${v}`} />
                    <Tooltip formatter={(v) => [`₹${v}/quintal`, 'Price']} />
                    <Bar dataKey="price" fill="#16a34a" radius={[6, 6, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              )}
            </div>
          </section>

          {/* Recent Alerts */}
          <section>
            <h2 className="font-semibold text-gray-700 mb-4 text-lg">🔔 Recent Alerts</h2>
            {alerts.length === 0 ? (
              <div className="card text-center py-10 text-gray-400">
                <p className="text-4xl mb-3">🔕</p>
                <p>No alerts sent yet. Alerts are sent automatically when better prices are found.</p>
              </div>
            ) : (
              <div className="space-y-3">
                {alerts.slice(0, 10).map((a, i) => (
                  <AlertBadge key={a._id} {...a} delay={i * 0.04} />
                ))}
              </div>
            )}
          </section>
        </>
      )}
    </PageWrapper>
  )
}
