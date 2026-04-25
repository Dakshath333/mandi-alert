import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import PageWrapper from '../components/PageWrapper'

const features = [
  { icon:'📊', title:'Live Mandi Prices', desc:'Min, max & modal prices from all APMC mandis updated daily.' },
  { icon:'🔍', title:'Filter by State / District', desc:'Drill down by state, district, mandi and commodity — just like Agmarknet.' },
  { icon:'📱', title:'SMS Price Alerts', desc:'Get an SMS the moment your crop fetches a better price at a nearby mandi.' },
  { icon:'📈', title:'Price Trends', desc:'See how prices have moved over the last few days for your crop.' },
  { icon:'⚖️', title:'Compare Mandis', desc:'Side-by-side comparison of modal prices across multiple APMCs.' },
  { icon:'🔔', title:'Auto Alerts Every 6 hrs', desc:'Background cron checks prices and notifies farmers automatically.' },
]

export default function LandingPage() {
  return (
    <PageWrapper>
      {/* Hero */}
      <section className="bg-gradient-to-br from-green-700 to-green-900 text-white relative overflow-hidden">
        <div className="absolute inset-0 opacity-5"
          style={{ backgroundImage:'radial-gradient(white 1px, transparent 1px)', backgroundSize:'40px 40px' }} />
        <div className="relative max-w-5xl mx-auto px-6 py-20 text-center">
          <motion.p initial={{ opacity:0 }} animate={{ opacity:1 }} transition={{ delay:0.05 }}
            className="text-green-300 text-sm font-medium mb-3 uppercase tracking-widest">
            Live APMC Price Portal
          </motion.p>
          <motion.h1 initial={{ opacity:0, y:24 }} animate={{ opacity:1, y:0 }} transition={{ duration:0.5 }}
            className="font-display text-4xl md:text-5xl font-bold mb-5 leading-tight">
            Know Your Mandi Price<br />
            <span className="text-green-300">Before You Load the Truck</span>
          </motion.h1>
          <motion.p initial={{ opacity:0, y:16 }} animate={{ opacity:1, y:0 }} transition={{ duration:0.5, delay:0.1 }}
            className="text-green-100 text-lg max-w-xl mx-auto mb-10 leading-relaxed">
            Real-time min, max & modal prices from APMC mandis across India. Filter by state, district, mandi or commodity. Get SMS alerts when better prices arrive.
          </motion.p>
          <motion.div initial={{ opacity:0, y:16 }} animate={{ opacity:1, y:0 }} transition={{ delay:0.2 }}
            className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link to="/prices">
              <motion.button whileHover={{ scale:1.04 }} whileTap={{ scale:0.97 }}
                className="bg-white text-green-800 font-bold px-8 py-3.5 rounded-xl text-sm shadow-lg hover:shadow-xl transition-all">
                📊 View Today's Prices
              </motion.button>
            </Link>
            <Link to="/register">
              <motion.button whileHover={{ scale:1.04 }} whileTap={{ scale:0.97 }}
                className="border-2 border-white text-white font-semibold px-8 py-3.5 rounded-xl text-sm hover:bg-white hover:text-green-800 transition-all">
                Register for Alerts →
              </motion.button>
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Stats strip */}
      <section className="bg-white border-y border-green-100">
        <div className="max-w-5xl mx-auto px-6 py-6 grid grid-cols-2 sm:grid-cols-4 gap-6 text-center">
          {[
            { val:'40+', label:'APMC Mandis' }, { val:'20+', label:'Commodities' },
            { val:'4 States', label:'Coverage' }, { val:'Free SMS', label:'Price Alerts' },
          ].map((s,i) => (
            <motion.div key={i} initial={{ opacity:0, y:12 }} whileInView={{ opacity:1, y:0 }}
              viewport={{ once:true }} transition={{ delay:i*0.08 }}>
              <p className="text-2xl font-bold text-green-700">{s.val}</p>
              <p className="text-sm text-gray-500 mt-0.5">{s.label}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Features */}
      <section className="max-w-5xl mx-auto px-6 py-16">
        <motion.div initial={{ opacity:0, y:16 }} whileInView={{ opacity:1, y:0 }} viewport={{ once:true }}
          className="text-center mb-10">
          <h2 className="font-display text-3xl font-bold text-gray-900 mb-2">
            All the tools farmers need
          </h2>
          <p className="text-gray-500 max-w-md mx-auto text-sm">
            Same data as government portals — in a clean, fast interface built for mobile.
          </p>
        </motion.div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {features.map((f,i) => (
            <motion.div key={i} initial={{ opacity:0, y:20 }} whileInView={{ opacity:1, y:0 }}
              viewport={{ once:true }} transition={{ delay:i*0.07 }}
              whileHover={{ y:-3, transition:{ duration:0.15 } }}
              className="card hover:border-green-300 hover:shadow-md transition-all">
              <span className="text-3xl mb-3 block">{f.icon}</span>
              <h3 className="font-semibold text-gray-900 mb-1 text-sm">{f.title}</h3>
              <p className="text-gray-500 text-sm leading-relaxed">{f.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* How it works */}
      <section className="bg-white border-y border-green-100 py-14">
        <div className="max-w-4xl mx-auto px-6">
          <h2 className="font-display text-2xl font-bold text-center text-gray-900 mb-10">How It Works</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 text-center">
            {[
              { step:'1', icon:'📋', title:'Register', desc:'Enter your name, phone, crop and district — takes 30 seconds.' },
              { step:'2', icon:'📡', title:'We Monitor', desc:'Our system checks mandi prices every 6 hours across all APMCs.' },
              { step:'3', icon:'📱', title:'You Get Alerted', desc:'When your crop fetches more at another mandi, you get an SMS instantly.' },
            ].map((s,i) => (
              <motion.div key={i} initial={{ opacity:0 }} whileInView={{ opacity:1 }}
                viewport={{ once:true }} transition={{ delay:i*0.15 }}>
                <div className="w-10 h-10 rounded-full bg-green-100 text-green-700 font-bold text-sm flex items-center justify-center mx-auto mb-3">
                  {s.step}
                </div>
                <span className="text-3xl block mb-2">{s.icon}</span>
                <h3 className="font-semibold text-gray-900 mb-1">{s.title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed">{s.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-green-700 text-white">
        <motion.div initial={{ opacity:0 }} whileInView={{ opacity:1 }} viewport={{ once:true }}
          className="max-w-2xl mx-auto px-6 py-14 text-center">
          <h2 className="font-display text-3xl font-bold mb-3">Start getting smarter prices today</h2>
          <p className="text-green-200 mb-7 text-sm">Free registration. No app to install. Just an SMS on your phone.</p>
          <Link to="/register">
            <motion.button whileHover={{ scale:1.04 }} whileTap={{ scale:0.95 }}
              className="bg-white text-green-800 font-bold px-10 py-3.5 rounded-xl shadow-xl text-sm">
              Register Now — It's Free
            </motion.button>
          </Link>
        </motion.div>
      </section>

      <footer className="bg-white border-t border-green-100 text-center py-5 text-xs text-gray-400">
        © 2025 MandiAlert · Crop price alerts for Indian farmers
      </footer>
    </PageWrapper>
  )
}
