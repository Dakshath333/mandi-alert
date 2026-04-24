import { useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import PageWrapper from '../components/PageWrapper'
import { getMarketPrices, getFilters, getDistricts, getMandis } from '../utils/api'

const CROP_EMOJI = { tomato:'🍅', onion:'🧅', potato:'🥔', rice:'🌾', maize:'🌽',
  sugarcane:'🎋', ragi:'🌾', groundnut:'🥜', wheat:'🌾', banana:'🍌',
  mango:'🥭', chilli:'🌶️', cotton:'🌿', coffee:'☕', coconut:'🥥',
  brinjal:'🍆', cabbage:'🥬', sunflower:'🌻', arecanut:'🌿' }
const emoji = (c='') => CROP_EMOJI[c.toLowerCase()] || '🌿'

function Spinner() {
  return (
    <div className="flex justify-center py-16">
      <motion.div animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
        className="w-9 h-9 border-4 border-green-200 border-t-green-600 rounded-full" />
    </div>
  )
}

export default function PricesPage() {
  const [prices, setPrices]       = useState([])
  const [filters, setFilters]     = useState({ states: [], crops: [] })
  const [districts, setDistricts] = useState([])
  const [mandis, setMandis]       = useState([])

  const [form, setForm] = useState({ state: '', district: '', mandi: '', crop: '', variety: '', date: '' })
  const [loading, setLoading]   = useState(false)
  const [searched, setSearched] = useState(false)
  const [sortKey, setSortKey]   = useState('modalPrice-desc')
  const [page, setPage]         = useState(1)
  const PER_PAGE = 20

  // Load dropdown options on mount
  useEffect(() => {
    getFilters().then(r => setFilters(r.data.data)).catch(() => {})
    // Initial load — show today's prices
    fetchPrices({})
  }, [])

  const fetchPrices = async (params) => {
    setLoading(true)
    try {
      const clean = Object.fromEntries(Object.entries(params).filter(([,v]) => v))
      const res = await getMarketPrices(clean)
      setPrices(res.data.data || [])
      setPage(1)
    } catch { setPrices([]) }
    finally { setLoading(false); setSearched(true) }
  }

  // Cascade: state → districts
  const onStateChange = async (state) => {
    setForm(f => ({ ...f, state, district: '', mandi: '' }))
    setDistricts([]); setMandis([])
    if (state) {
      const r = await getDistricts(state).catch(() => ({ data: { data: [] } }))
      setDistricts(r.data.data)
    }
  }

  // Cascade: district → mandis
  const onDistrictChange = async (district) => {
    setForm(f => ({ ...f, district, mandi: '' }))
    setMandis([])
    if (district) {
      const r = await getMandis(district, form.state).catch(() => ({ data: { data: [] } }))
      setMandis(r.data.data)
    }
  }

  const handleSearch = (e) => {
    e.preventDefault()
    fetchPrices(form)
  }

  const handleReset = () => {
    setForm({ state:'', district:'', mandi:'', crop:'', variety:'', date:'' })
    setDistricts([]); setMandis([])
    fetchPrices({})
  }

  // Sort
  const sorted = [...prices].sort((a, b) => {
    const [key, dir] = sortKey.split('-')
    const fields = { modalPrice:'modalPrice', minPrice:'minPrice', maxPrice:'maxPrice', arrivals:'arrivals', mandi:'mandi', crop:'crop' }
    const f = fields[key] || 'modalPrice'
    if (typeof a[f] === 'string') return dir==='asc' ? a[f].localeCompare(b[f]) : b[f].localeCompare(a[f])
    return dir==='asc' ? a[f]-b[f] : b[f]-a[f]
  })

  const paginated = sorted.slice((page-1)*PER_PAGE, page*PER_PAGE)
  const totalPages = Math.ceil(sorted.length / PER_PAGE)

  // Best price per crop (for summary cards)
  const cropBest = {}
  prices.forEach(p => {
    if (!cropBest[p.crop] || p.modalPrice > cropBest[p.crop].modalPrice) cropBest[p.crop] = p
  })
  const topCrops = Object.values(cropBest).sort((a,b) => b.modalPrice - a.modalPrice).slice(0,6)

  const handleSort = (key) => {
    setSortKey(prev => prev === `${key}-desc` ? `${key}-asc` : `${key}-desc`)
  }
  const sortIcon = (key) => {
    if (!sortKey.startsWith(key)) return <span className="text-gray-300 ml-1">↕</span>
    return sortKey.endsWith('desc')
      ? <span className="text-green-600 ml-1">↓</span>
      : <span className="text-green-600 ml-1">↑</span>
  }

  return (
    <PageWrapper className="max-w-7xl mx-auto px-4 py-8">
      <div className="mb-6">
        <h1 className="font-display text-2xl font-bold text-gray-900">Market Prices</h1>
        <p className="text-gray-500 text-sm mt-1">
          Live APMC mandi prices — min, max & modal price per quintal
        </p>
      </div>

      {/* Search / Filter Panel */}
      <motion.div initial={{ opacity:0, y:-10 }} animate={{ opacity:1, y:0 }} className="card mb-6">
        <h2 className="font-semibold text-gray-800 mb-4 text-sm">🔍 Filter Prices</h2>
        <form onSubmit={handleSearch}>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 mb-4">
            {/* State */}
            <div>
              <label className="label">State</label>
              <select className="select-field" value={form.state}
                onChange={e => onStateChange(e.target.value)}>
                <option value="">All States</option>
                {filters.states.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
            {/* District */}
            <div>
              <label className="label">District</label>
              <select className="select-field" value={form.district}
                onChange={e => onDistrictChange(e.target.value)}
                disabled={!form.state && !districts.length}>
                <option value="">All Districts</option>
                {districts.map(d => <option key={d} value={d}>{d}</option>)}
              </select>
            </div>
            {/* Mandi */}
            <div>
              <label className="label">Mandi / APMC</label>
              <select className="select-field" value={form.mandi}
                onChange={e => setForm(f=>({...f,mandi:e.target.value}))}
                disabled={!mandis.length}>
                <option value="">All Mandis</option>
                {mandis.map(m => <option key={m} value={m}>{m}</option>)}
              </select>
            </div>
            {/* Crop */}
            <div>
              <label className="label">Commodity</label>
              <select className="select-field" value={form.crop}
                onChange={e => setForm(f=>({...f,crop:e.target.value}))}>
                <option value="">All Crops</option>
                {filters.crops.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            {/* Variety */}
            <div>
              <label className="label">Variety</label>
              <input className="input-field" placeholder="e.g. Hybrid" value={form.variety}
                onChange={e => setForm(f=>({...f,variety:e.target.value}))} />
            </div>
            {/* Date */}
            <div>
              <label className="label">Date</label>
              <input type="date" className="input-field" value={form.date}
                onChange={e => setForm(f=>({...f,date:e.target.value}))} />
            </div>
          </div>
          <div className="flex gap-3">
            <motion.button type="submit" whileTap={{ scale:0.97 }} className="btn-primary">
              Search Prices
            </motion.button>
            <button type="button" onClick={handleReset} className="btn-secondary">
              Reset
            </button>
          </div>
        </form>
      </motion.div>

      {/* Summary cards */}
      {topCrops.length > 0 && !loading && (
        <div className="mb-6">
          <h2 className="font-semibold text-gray-700 text-sm mb-3">📌 Best Modal Prices</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
            {topCrops.map((p, i) => (
              <motion.div key={p.crop+i}
                initial={{ opacity:0, y:12 }} animate={{ opacity:1, y:0 }} transition={{ delay: i*0.05 }}
                whileHover={{ y:-2 }}
                onClick={() => { setForm(f=>({...f, crop:p.crop})); fetchPrices({ ...form, crop:p.crop }) }}
                className="card-flat cursor-pointer hover:border-green-400 transition-all">
                <div className="text-2xl mb-1">{emoji(p.crop)}</div>
                <p className="font-semibold text-xs text-gray-700 truncate">{p.crop}</p>
                <p className="text-green-700 font-bold text-base">₹{p.modalPrice.toLocaleString('en-IN')}</p>
                <p className="text-xs text-gray-400 truncate">{p.mandi}</p>
              </motion.div>
            ))}
          </div>
        </div>
      )}

      {/* Results */}
      <div className="card">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
          <div>
            <h2 className="font-semibold text-gray-800">
              {loading ? 'Loading…' : `${sorted.length} records found`}
            </h2>
            <p className="text-xs text-gray-400 mt-0.5">
              Prices in ₹ per quintal (100 kg) · Arrivals in tonnes
            </p>
          </div>
          <div className="flex items-center gap-2">
            <label className="text-xs text-gray-500">Sort:</label>
            <select className="select-field !w-auto !py-1.5 text-xs" value={sortKey}
              onChange={e => { setSortKey(e.target.value); setPage(1) }}>
              <option value="modalPrice-desc">Modal Price ↓</option>
              <option value="modalPrice-asc">Modal Price ↑</option>
              <option value="arrivals-desc">Arrivals ↓</option>
              <option value="crop-asc">Crop A–Z</option>
              <option value="mandi-asc">Mandi A–Z</option>
            </select>
          </div>
        </div>

        {loading ? <Spinner /> : sorted.length === 0 ? (
          <div className="text-center py-14">
            <p className="text-4xl mb-3">📭</p>
            <p className="font-semibold text-gray-600">No prices found</p>
            <p className="text-sm text-gray-400 mt-1">
              {!searched ? 'Use the filters above to search.' : 'Try different filters.'}
            </p>
          </div>
        ) : (
          <>
            <div className="overflow-x-auto rounded-xl border border-gray-100">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    {[['crop','Commodity'], ['mandi','Mandi / APMC'], ['district','District'],
                      ['state','State'], ['variety','Variety'], ['arrivals','Arrivals (T)'],
                      ['minPrice','Min ₹'], ['maxPrice','Max ₹'], ['modalPrice','Modal ₹'], ['date','Date']
                    ].map(([key, label]) => (
                      <th key={key} onClick={() => handleSort(key)}
                        className="th cursor-pointer select-none hover:text-green-700 whitespace-nowrap">
                        {label}{sortIcon(key)}
                      </th>
                    ))}
                  </tr>
                </thead>
                <AnimatePresence>
                  <tbody>
                    {paginated.map((p, i) => {
                      const isTopForCrop = cropBest[p.crop]?._id === p._id || cropBest[p.crop]?.modalPrice === p.modalPrice && cropBest[p.crop]?.mandi === p.mandi
                      return (
                        <motion.tr key={p._id || i}
                          initial={{ opacity:0 }} animate={{ opacity:1 }} transition={{ delay: i*0.015 }}
                          className={`tr-hover ${isTopForCrop ? 'bg-green-50' : ''}`}>
                          <td className="td font-medium">
                            <span className="flex items-center gap-1.5">
                              <span>{emoji(p.crop)}</span>{p.crop}
                            </span>
                          </td>
                          <td className="td">{p.mandi}</td>
                          <td className="td text-gray-500">{p.district}</td>
                          <td className="td text-gray-500">{p.state}</td>
                          <td className="td text-gray-500">{p.variety}</td>
                          <td className="td text-center">{p.arrivals?.toLocaleString('en-IN') ?? '—'}</td>
                          <td className="td text-right text-gray-500">₹{p.minPrice?.toLocaleString('en-IN')}</td>
                          <td className="td text-right text-gray-500">₹{p.maxPrice?.toLocaleString('en-IN')}</td>
                          <td className="td text-right font-bold text-green-700">
                            ₹{p.modalPrice?.toLocaleString('en-IN')}
                            {isTopForCrop && <span className="ml-1.5 badge-best">Best</span>}
                          </td>
                          <td className="td text-gray-400 text-xs whitespace-nowrap">
                            {new Date(p.date).toLocaleDateString('en-IN',{day:'numeric',month:'short'})}
                          </td>
                        </motion.tr>
                      )
                    })}
                  </tbody>
                </AnimatePresence>
              </table>
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-100">
                <p className="text-xs text-gray-400">
                  Page {page} of {totalPages} · {sorted.length} records
                </p>
                <div className="flex gap-2">
                  <button onClick={() => setPage(p=>Math.max(1,p-1))} disabled={page===1}
                    className="btn-sm disabled:opacity-40 !bg-gray-100 !text-gray-600 hover:!bg-gray-200">← Prev</button>
                  <button onClick={() => setPage(p=>Math.min(totalPages,p+1))} disabled={page===totalPages}
                    className="btn-sm disabled:opacity-40">Next →</button>
                </div>
              </div>
            )}
          </>
        )}
      </div>

      {/* Disclaimer */}
      <p className="text-xs text-gray-400 mt-4 text-center">
        Prices are indicative. Source: APMC mandi records. Verify before selling.
      </p>
    </PageWrapper>
  )
}
