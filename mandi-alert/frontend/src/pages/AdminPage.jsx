import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import PageWrapper from '../components/PageWrapper'
import { getAdminStats, getFarmers, triggerAlerts, addMarketPrice, getMarketPrices } from '../utils/api'

const TABS = ['Overview','Farmers','Prices','Add Price','Trigger Alerts']

export default function AdminPage() {
  const [tab, setTab]           = useState('Overview')
  const [stats, setStats]       = useState(null)
  const [farmers, setFarmers]   = useState([])
  const [prices, setPrices]     = useState([])
  const [loading, setLoading]   = useState(true)
  const [triggering, setTriggering] = useState(false)
  const [trigResult, setTrigResult] = useState(null)
  const [priceForm, setPF]      = useState({ state:'', district:'', mandi:'', crop:'', variety:'General', arrivals:0, minPrice:'', maxPrice:'', modalPrice:'' })
  const [priceMsg, setPriceMsg] = useState('')
  const [pass, setPass]         = useState('')
  const [auth, setAuth]         = useState(false)
  const PASS = 'admin123'

  useEffect(() => { if (auth) fetchAll() }, [auth])

  const fetchAll = async () => {
    setLoading(true)
    try {
      const [s,f,p] = await Promise.all([getAdminStats(), getFarmers(), getMarketPrices()])
      setStats(s.data.data); setFarmers(f.data.data||[]); setPrices(p.data.data||[])
    } catch {}
    finally { setLoading(false) }
  }

  if (!auth) return (
    <PageWrapper className="min-h-[80vh] flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <motion.div initial={{opacity:0,y:-16}} animate={{opacity:1,y:0}} className="text-center mb-8">
          <span className="text-4xl block mb-3">⚙️</span>
          <h1 className="font-display text-2xl font-bold text-gray-900">Admin Access</h1>
          <p className="text-gray-400 text-sm mt-1">Restricted — authorised personnel only</p>
        </motion.div>
        <motion.div initial={{opacity:0,y:16}} animate={{opacity:1,y:0}} transition={{delay:0.1}} className="card">
          <label className="label">Admin Password</label>
          <input type="password" value={pass} onChange={e=>setPass(e.target.value)}
            onKeyDown={e=>e.key==='Enter'&&(pass===PASS?setAuth(true):alert('Incorrect. Try: admin123'))}
            placeholder="Enter password" className="input-field mb-4" autoFocus />
          <button onClick={() => pass===PASS ? setAuth(true) : alert('Incorrect. Try: admin123')}
            className="btn-primary w-full text-center">Login</button>
          <p className="text-xs text-gray-400 text-center mt-3">Demo: <code className="bg-gray-100 px-1 rounded">admin123</code></p>
        </motion.div>
      </div>
    </PageWrapper>
  )

  return (
    <PageWrapper className="max-w-6xl mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="font-display text-2xl font-bold text-gray-900">Admin Dashboard</h1>
          <p className="text-gray-500 text-sm mt-1">Manage farmers, prices and alerts</p>
        </div>
        <button onClick={()=>setAuth(false)}
          className="text-xs border border-red-200 text-red-500 hover:bg-red-50 px-3 py-1.5 rounded-lg transition-colors">
          Logout
        </button>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 bg-white border border-green-100 rounded-xl p-1 mb-6 w-fit shadow-sm flex-wrap">
        {TABS.map(t=>(
          <button key={t} onClick={()=>setTab(t)}
            className={`px-4 py-2 text-sm font-medium rounded-lg transition-all ${
              tab===t ? 'bg-green-600 text-white shadow-sm' : 'text-gray-600 hover:bg-green-50'
            }`}>{t}</button>
        ))}
      </div>

      {loading ? (
        <div className="flex justify-center py-16">
          <motion.div animate={{rotate:360}} transition={{duration:1,repeat:Infinity,ease:'linear'}}
            className="w-9 h-9 border-4 border-green-200 border-t-green-600 rounded-full"/>
        </div>
      ) : (
        <>
          {/* OVERVIEW */}
          {tab==='Overview' && (
            <div className="space-y-5">
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                {[
                  {icon:'🧑‍🌾',label:'Farmers',value:stats?.totalFarmers??0,color:'border-l-green-500'},
                  {icon:'🏪',label:'Mandis',value:stats?.totalMarkets??0,color:'border-l-blue-500'},
                  {icon:'📱',label:'Alerts Sent',value:stats?.totalAlerts??0,color:'border-l-amber-500'},
                  {icon:'🌿',label:'Top Crop',value:stats?.topCrops?.[0]?._id??'—',color:'border-l-purple-500'},
                ].map((s,i)=>(
                  <motion.div key={i} initial={{opacity:0,y:12}} animate={{opacity:1,y:0}} transition={{delay:i*0.08}}
                    className={`card border-l-4 ${s.color}`}>
                    <p className="text-xs text-gray-500">{s.icon} {s.label}</p>
                    <p className="text-2xl font-bold text-gray-900 mt-1">{s.value}</p>
                  </motion.div>
                ))}
              </div>
              {stats?.topCrops?.length > 0 && (
                <div className="card">
                  <h3 className="font-semibold text-sm text-gray-800 mb-3">Popular Crops</h3>
                  <div className="space-y-2">
                    {stats.topCrops.map((c,i)=>{
                      const max = stats.topCrops[0].count
                      return (
                        <div key={i} className="flex items-center gap-3">
                          <span className="text-xs text-gray-500 w-24 flex-shrink-0">{c._id}</span>
                          <div className="flex-1 bg-gray-100 rounded-full h-3 overflow-hidden">
                            <motion.div initial={{width:0}} animate={{width:`${(c.count/max)*100}%`}}
                              transition={{delay:i*0.08, duration:0.5}}
                              className="bg-green-500 h-full rounded-full"/>
                          </div>
                          <span className="text-xs font-semibold text-green-700 w-16 text-right">{c.count} farmers</span>
                        </div>
                      )
                    })}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* FARMERS */}
          {tab==='Farmers' && (
            <div className="card">
              <div className="flex items-center justify-between mb-4">
                <h2 className="font-semibold text-gray-800 text-sm">Registered Farmers ({farmers.length})</h2>
                <button onClick={fetchAll} className="btn-sm">🔄 Refresh</button>
              </div>
              {farmers.length===0 ? (
                <p className="text-center text-gray-400 py-10">No farmers registered yet.</p>
              ) : (
                <div className="overflow-x-auto rounded-xl border border-gray-100">
                  <table className="w-full">
                    <thead className="bg-gray-50">
                      <tr>{['#','Name','Mobile','Crop','District','Registered'].map(h=>(
                        <th key={h} className="th">{h}</th>
                      ))}</tr>
                    </thead>
                    <tbody>
                      {farmers.map((f,i)=>(
                        <motion.tr key={f._id} initial={{opacity:0}} animate={{opacity:1}} transition={{delay:i*0.03}}
                          className="tr-hover">
                          <td className="td text-gray-400 text-xs">{i+1}</td>
                          <td className="td font-medium">{f.name}</td>
                          <td className="td text-gray-500">+91 {f.phone}</td>
                          <td className="td"><span className="badge-best">{f.crop}</span></td>
                          <td className="td text-gray-500">{f.location}</td>
                          <td className="td text-gray-400 text-xs">
                            {new Date(f.createdAt).toLocaleDateString('en-IN',{day:'numeric',month:'short',year:'2-digit'})}
                          </td>
                        </motion.tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}

          {/* PRICES */}
          {tab==='Prices' && (
            <div className="card">
              <h2 className="font-semibold text-gray-800 text-sm mb-4">Market Price Records ({prices.length})</h2>
              <div className="overflow-x-auto rounded-xl border border-gray-100">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>{['Crop','Mandi','District','State','Min ₹','Max ₹','Modal ₹','Arrivals','Date'].map(h=>(
                      <th key={h} className="th">{h}</th>
                    ))}</tr>
                  </thead>
                  <tbody>
                    {prices.slice(0,100).map((p,i)=>(
                      <tr key={p._id||i} className="tr-hover">
                        <td className="td font-medium">{p.crop}</td>
                        <td className="td text-gray-500">{p.mandi}</td>
                        <td className="td text-gray-500">{p.district}</td>
                        <td className="td text-gray-500">{p.state}</td>
                        <td className="td text-right text-gray-500">₹{p.minPrice?.toLocaleString('en-IN')}</td>
                        <td className="td text-right text-gray-500">₹{p.maxPrice?.toLocaleString('en-IN')}</td>
                        <td className="td text-right font-bold text-green-700">₹{p.modalPrice?.toLocaleString('en-IN')}</td>
                        <td className="td text-center">{p.arrivals?.toLocaleString('en-IN')}</td>
                        <td className="td text-xs text-gray-400">
                          {new Date(p.date).toLocaleDateString('en-IN',{day:'numeric',month:'short'})}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* ADD PRICE */}
          {tab==='Add Price' && (
            <div className="card max-w-xl">
              <h2 className="font-semibold text-gray-800 text-sm mb-4">Add Market Price Entry</h2>
              <form onSubmit={async e=>{
                e.preventDefault()
                if (!priceForm.crop||!priceForm.mandi||!priceForm.district||!priceForm.modalPrice) {
                  setPriceMsg('⚠️ Crop, Mandi, District and Modal Price are required.'); return
                }
                try {
                  await addMarketPrice({ ...priceForm, minPrice:Number(priceForm.minPrice)||0, maxPrice:Number(priceForm.maxPrice)||0, modalPrice:Number(priceForm.modalPrice), arrivals:Number(priceForm.arrivals)||0 })
                  setPriceMsg('✅ Price entry added!')
                  setPF({ state:'',district:'',mandi:'',crop:'',variety:'General',arrivals:0,minPrice:'',maxPrice:'',modalPrice:'' })
                  fetchAll()
                } catch { setPriceMsg('❌ Failed to add entry.') }
              }} className="space-y-3">
                <div className="grid grid-cols-2 gap-3">
                  {[['state','State'],['district','District *'],['mandi','Mandi / APMC *'],['crop','Crop *'],['variety','Variety'],['arrivals','Arrivals (tonnes)'],['minPrice','Min Price ₹'],['maxPrice','Max Price ₹'],['modalPrice','Modal Price ₹ *']].map(([k,l])=>(
                    <div key={k}>
                      <label className="label">{l}</label>
                      <input value={priceForm[k]} onChange={e=>setPF(p=>({...p,[k]:e.target.value}))}
                        type={['arrivals','minPrice','maxPrice','modalPrice'].includes(k)?'number':'text'}
                        min="0" placeholder={l} className="input-field" />
                    </div>
                  ))}
                </div>
                {priceMsg && (
                  <div className={`text-xs p-3 rounded-lg ${priceMsg.startsWith('✅')?'bg-green-50 text-green-700 border border-green-200':'bg-red-50 text-red-600 border border-red-200'}`}>
                    {priceMsg}
                  </div>
                )}
                <div className="flex gap-3 pt-1">
                  <button type="submit" className="btn-primary">Add Entry</button>
                  <button type="button" onClick={()=>setPF({state:'',district:'',mandi:'',crop:'',variety:'General',arrivals:0,minPrice:'',maxPrice:'',modalPrice:''})} className="btn-secondary">Reset</button>
                </div>
              </form>
            </div>
          )}

          {/* TRIGGER ALERTS */}
          {tab==='Trigger Alerts' && (
            <div className="card max-w-lg">
              <h2 className="font-semibold text-gray-800 text-sm mb-2">Trigger SMS Price Alerts</h2>
              <p className="text-xs text-gray-500 mb-5 leading-relaxed">
                This checks all farmers, finds the best modal price for each farmer's crop,
                and sends an SMS if a better price (&gt;5% difference) is available at another mandi.
                Duplicate alerts within 24 hours are suppressed.
              </p>
              <motion.button whileTap={{ scale:0.97 }} onClick={async()=>{
                setTriggering(true); setTrigResult(null)
                try { const r = await triggerAlerts(); setTrigResult(r.data); fetchAll() }
                catch { setTrigResult({ message:'Failed — is the backend running?', results:[] }) }
                finally { setTriggering(false) }
              }} disabled={triggering} className="btn-primary disabled:opacity-60 mb-5">
                {triggering ? '⏳ Sending Alerts…' : '📣 Send Alerts Now'}
              </motion.button>

              {trigResult && (
                <motion.div initial={{ opacity:0, y:8 }} animate={{ opacity:1, y:0 }}
                  className="bg-gray-50 rounded-xl border border-gray-200 p-4">
                  <p className="font-semibold text-sm text-gray-800 mb-3">{trigResult.message}</p>
                  {trigResult.results?.length > 0 ? (
                    <div className="space-y-2">
                      {trigResult.results.map((r,i)=>(
                        <div key={i} className="flex items-center gap-2 text-sm">
                          <span>{r.status==='sent'?'✅':'📋'}</span>
                          <span className="font-medium">{r.farmer}</span>
                          <span className="text-gray-400 text-xs">{r.phone}</span>
                          <span className={`ml-auto text-xs font-semibold px-2 py-0.5 rounded-full ${r.status==='sent'?'bg-green-100 text-green-700':'bg-amber-100 text-amber-700'}`}>{r.status}</span>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-xs text-gray-400">No alerts triggered (no price advantages found or no farmers registered).</p>
                  )}
                </motion.div>
              )}
            </div>
          )}
        </>
      )}
    </PageWrapper>
  )
}
