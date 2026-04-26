import { useState, useEffect } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, LineChart, Line, Legend } from 'recharts'
import PageWrapper from '../components/PageWrapper'
import { getMarketPrices, comparePrices, getFarmerAlerts, updateFarmer } from '../utils/api'

const CROPS = ['Tomato','Onion','Potato','Rice','Maize','Sugarcane','Ragi','Groundnut','Wheat']
const EMOJI = { tomato:'🍅',onion:'🧅',potato:'🥔',rice:'🌾',maize:'🌽',sugarcane:'🎋',ragi:'🌾',groundnut:'🥜',wheat:'🌾' }
const e = (c='') => EMOJI[c.toLowerCase()] || '🌿'

function Spinner() {
  return (
    <div className="flex justify-center py-12">
      <motion.div animate={{ rotate:360 }} transition={{ duration:1, repeat:Infinity, ease:'linear' }}
        className="w-8 h-8 border-4 border-green-200 border-t-green-600 rounded-full" />
    </div>
  )
}

export default function DashboardPage() {
  const navigate = useNavigate()
  const farmer = JSON.parse(localStorage.getItem('farmer') || 'null')
  const [prices, setPrices]     = useState([])
  const [alerts, setAlerts]     = useState([])
  const [compare, setCompare]   = useState([])
  const [trend, setTrend]       = useState([])
  const [compareCrop, setCompareCrop] = useState(farmer?.crop || 'Tomato')
  const [loading, setLoading]   = useState(true)
  const [editOpen, setEditOpen] = useState(false)
  const [editForm, setEditForm] = useState({ crop:farmer?.crop||'', location:farmer?.location||'' })
  const [saveMsg, setSaveMsg]   = useState('')

  useEffect(() => {
    if (!farmer) { navigate('/login'); return }
    fetchAll()
  }, [])

  useEffect(() => { fetchCompare() }, [compareCrop])

  const fetchAll = async () => {
    setLoading(true)
    try {
      const [priceRes, alertRes, trendRes] = await Promise.all([
        getMarketPrices(),
        getFarmerAlerts(farmer._id),
        // Trend: last 3 days for farmer's crop in their district
        getMarketPrices({ crop: farmer.crop }),
      ])
      setPrices(priceRes.data.data || [])
      setAlerts(alertRes.data.data || [])

      // Build trend data grouped by date
      const raw = trendRes.data.data || []
      const byDate = {}
      raw.forEach(p => {
        const d = new Date(p.date).toLocaleDateString('en-IN',{day:'numeric',month:'short'})
        if (!byDate[d]) byDate[d] = { date:d, min:[], max:[], modal:[] }
        byDate[d].min.push(p.minPrice)
        byDate[d].max.push(p.maxPrice)
        byDate[d].modal.push(p.modalPrice)
      })
      const trendData = Object.values(byDate).map(d => ({
        date: d.date,
        'Min Price': Math.round(d.min.reduce((a,b)=>a+b,0)/d.min.length),
        'Max Price': Math.round(d.max.reduce((a,b)=>a+b,0)/d.max.length),
        'Modal Price': Math.round(d.modal.reduce((a,b)=>a+b,0)/d.modal.length),
      })).slice(-7)
      setTrend(trendData)
    } catch {}
    finally { setLoading(false) }
  }

  const fetchCompare = async () => {
    try {
      const res = await comparePrices({ crop: compareCrop })
      setCompare(res.data.allMandis || [])
    } catch { setCompare([]) }
  }

  const handleSave = async () => {
    try {
      await updateFarmer(farmer._id, editForm)
      const updated = { ...farmer, ...editForm }
      localStorage.setItem('farmer', JSON.stringify(updated))
      setSaveMsg('✅ Preferences saved!')
      setEditOpen(false)
      setTimeout(() => setSaveMsg(''), 3000)
    } catch { setSaveMsg('❌ Update failed.') }
  }

  const myPrices = prices.filter(p => p.crop?.toLowerCase() === farmer?.crop?.toLowerCase())
  const bestPrice = myPrices.length ? myPrices.reduce((a,b) => a.modalPrice > b.modalPrice ? a : b) : null
  const localPrice = myPrices.find(p => p.district?.toLowerCase() === farmer?.location?.toLowerCase()
    || p.location?.toLowerCase() === farmer?.location?.toLowerCase())
  const priceDiff = bestPrice && localPrice && bestPrice.modalPrice > localPrice.modalPrice
    ? bestPrice.modalPrice - localPrice.modalPrice : 0

  return (
    <PageWrapper className="max-w-6xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-7">
        <div>
          <h1 className="font-display text-2xl font-bold text-gray-900">
            {e(farmer?.crop)} My Dashboard
          </h1>
          <p className="text-gray-500 text-sm mt-1">
            {farmer?.name} · {farmer?.crop} · {farmer?.location}
          </p>
        </div>
        <button onClick={() => setEditOpen(!editOpen)} className="btn-secondary text-xs">
          {editOpen ? '✕ Close' : '✏️ Update Preferences'}
        </button>
      </div>

      {/* Edit Panel */}
      {editOpen && (
        <motion.div initial={{ opacity:0, y:-10 }} animate={{ opacity:1, y:0 }}
          className="card mb-6 border-green-300 border-2">
          <h3 className="font-semibold text-sm text-gray-800 mb-3">Update Crop & Location</h3>
          <div className="flex flex-wrap gap-3 items-end">
            <div>
              <label className="label">Crop</label>
              <select value={editForm.crop} onChange={e=>setEditForm(p=>({...p,crop:e.target.value}))} className="select-field w-40">
                {CROPS.map(c=><option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            <div>
              <label className="label">District</label>
              <input value={editForm.location} onChange={e=>setEditForm(p=>({...p,location:e.target.value}))}
                className="input-field w-40" placeholder="Your district" />
            </div>
            <button onClick={handleSave} className="btn-primary">Save</button>
          </div>
          {saveMsg && <p className="text-xs text-green-700 mt-2 font-medium">{saveMsg}</p>}
        </motion.div>
      )}

      {loading ? <Spinner /> : (
        <>
          {/* Key metrics */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-7">
            {[
              {
                icon:'🏆', label:`Best for ${farmer?.crop}`,
                value: bestPrice ? `₹${bestPrice.modalPrice.toLocaleString('en-IN')}` : '—',
                sub: bestPrice ? `${bestPrice.mandi}, ${bestPrice.district||bestPrice.location}` : 'No data yet',
                color:'border-l-green-500',
              },
              {
                icon:'📍', label:'Your Local Rate',
                value: localPrice ? `₹${localPrice.modalPrice.toLocaleString('en-IN')}` : '—',
                sub: localPrice ? `${localPrice.mandi}` : `No data for ${farmer?.location}`,
                color:'border-l-blue-400',
              },
              {
                icon:'💰', label:'Extra per Quintal',
                value: priceDiff > 0 ? `+₹${priceDiff.toLocaleString('en-IN')}` : localPrice ? 'Local is best!' : '—',
                sub: priceDiff > 0 ? `by selling at ${bestPrice?.mandi}` : priceDiff === 0 && localPrice ? 'Keep selling locally' : '',
                color: priceDiff > 0 ? 'border-l-orange-500' : 'border-l-gray-300',
              },
            ].map((s,i) => (
              <motion.div key={i} initial={{ opacity:0, y:14 }} animate={{ opacity:1, y:0 }} transition={{ delay:i*0.1 }}
                className={`card border-l-4 ${s.color}`}>
                <p className="text-xs text-gray-500 mb-1">{s.icon} {s.label}</p>
                <p className="text-2xl font-bold text-gray-900">{s.value}</p>
                <p className="text-xs text-gray-400 mt-0.5">{s.sub}</p>
              </motion.div>
            ))}
          </div>

          {/* Charts row */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 mb-7">
            {/* Compare chart */}
            <div className="card">
              <div className="flex items-center justify-between mb-4">
                <h2 className="font-semibold text-gray-800 text-sm">📊 Modal Price Comparison</h2>
                <select value={compareCrop} onChange={e=>setCompareCrop(e.target.value)}
                  className="select-field !w-28 !py-1.5 text-xs">
                  {CROPS.map(c=><option key={c} value={c}>{c}</option>)}
                </select>
              </div>
              {compare.length === 0 ? (
                <p className="text-center text-gray-400 text-sm py-8">No data for {compareCrop}</p>
              ) : (
                <ResponsiveContainer width="100%" height={220}>
                  <BarChart data={compare} margin={{ top:5, right:5, left:0, bottom:30 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0fdf4" />
                    <XAxis dataKey="mandi" tick={{ fontSize:10 }} interval={0} angle={-25} textAnchor="end" />
                    <YAxis tick={{ fontSize:10 }} tickFormatter={v=>`₹${(v/1000).toFixed(1)}k`} />
                    <Tooltip formatter={v=>[`₹${v.toLocaleString('en-IN')}/qtl`,'Modal Price']} />
                    <Bar dataKey="modalPrice" name="Modal Price" fill="#16a34a" radius={[4,4,0,0]} />
                  </BarChart>
                </ResponsiveContainer>
              )}
            </div>

            {/* Trend chart */}
            <div className="card">
              <h2 className="font-semibold text-gray-800 text-sm mb-4">📈 {farmer?.crop} Price Trend</h2>
              {trend.length < 2 ? (
                <p className="text-center text-gray-400 text-sm py-8">Not enough data for trend yet.</p>
              ) : (
                <ResponsiveContainer width="100%" height={220}>
                  <LineChart data={trend} margin={{ top:5, right:10, left:0, bottom:5 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0fdf4" />
                    <XAxis dataKey="date" tick={{ fontSize:10 }} />
                    <YAxis tick={{ fontSize:10 }} tickFormatter={v=>`₹${(v/1000).toFixed(1)}k`} />
                    <Tooltip formatter={v=>[`₹${v.toLocaleString('en-IN')}/qtl`]} />
                    <Legend iconSize={10} wrapperStyle={{ fontSize:11 }} />
                    <Line type="monotone" dataKey="Min Price" stroke="#86efac" strokeWidth={2} dot={false} />
                    <Line type="monotone" dataKey="Modal Price" stroke="#16a34a" strokeWidth={2.5} dot={{ r:3 }} />
                    <Line type="monotone" dataKey="Max Price" stroke="#15803d" strokeWidth={2} dot={false} strokeDasharray="4 2" />
                  </LineChart>
                </ResponsiveContainer>
              )}
            </div>
          </div>

          {/* All mandi prices for farmer's crop */}
          <div className="card mb-7">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-semibold text-gray-800 text-sm">🏪 All Mandis — {farmer?.crop}</h2>
              <Link to="/prices" className="text-xs text-green-600 hover:underline">View All Prices →</Link>
            </div>
            {myPrices.length === 0 ? (
              <p className="text-center text-gray-400 text-sm py-8">
                No price data yet. <Link to="/prices" className="text-green-600 hover:underline">Browse all prices.</Link>
              </p>
            ) : (
              <div className="overflow-x-auto rounded-xl border border-gray-100">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      {['Mandi','District','State','Variety','Arrivals (T)','Min ₹','Max ₹','Modal ₹'].map(h=>(
                        <th key={h} className="th">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {myPrices.sort((a,b)=>b.modalPrice-a.modalPrice).map((p,i)=>(
                      <motion.tr key={p._id||i} initial={{opacity:0}} animate={{opacity:1}} transition={{delay:i*0.02}}
                        className={`tr-hover ${i===0 ? 'bg-green-50' : ''}`}>
                        <td className="td font-medium">{p.mandi}</td>
                        <td className="td text-gray-500">{p.district}</td>
                        <td className="td text-gray-500">{p.state}</td>
                        <td className="td text-gray-500">{p.variety}</td>
                        <td className="td text-center">{p.arrivals?.toLocaleString('en-IN')}</td>
                        <td className="td text-right text-gray-500">₹{p.minPrice?.toLocaleString('en-IN')}</td>
                        <td className="td text-right text-gray-500">₹{p.maxPrice?.toLocaleString('en-IN')}</td>
                        <td className="td text-right font-bold text-green-700">
                          ₹{p.modalPrice?.toLocaleString('en-IN')}
                          {i===0 && <span className="ml-1 badge-best">Best</span>}
                        </td>
                      </motion.tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          {/* Alerts */}
          <div className="card">
            <h2 className="font-semibold text-gray-800 text-sm mb-4">📱 SMS Alert History</h2>
            {alerts.length === 0 ? (
              <div className="text-center py-8 border border-dashed border-gray-200 rounded-xl">
                <p className="text-3xl mb-2">📭</p>
                <p className="text-sm text-gray-500">No alerts yet.</p>
                <p className="text-xs text-gray-400 mt-1">
                  You'll get an SMS when your crop fetches a better price at another mandi.
                </p>
              </div>
            ) : (
              <div className="space-y-2">
                {alerts.slice(0,10).map((a,i)=>(
                  <motion.div key={a._id} initial={{opacity:0,x:-8}} animate={{opacity:1,x:0}} transition={{delay:i*0.04}}
                    className="flex gap-3 p-3 bg-gray-50 rounded-xl border border-gray-100">
                    <span className="text-xl mt-0.5">📱</span>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-gray-700">{a.message}</p>
                      <div className="flex gap-2 mt-1.5 items-center">
                        <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${
                          a.status==='sent' ? 'bg-green-100 text-green-700'
                          : a.status==='simulated' ? 'bg-amber-100 text-amber-700'
                          : 'bg-red-100 text-red-600'
                        }`}>{a.status}</span>
                        <span className="text-xs text-gray-400">
                          {new Date(a.sentAt).toLocaleString('en-IN',{day:'numeric',month:'short',hour:'2-digit',minute:'2-digit'})}
                        </span>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        </>
      )}
    </PageWrapper>
  )
}
