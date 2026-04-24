import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import PageWrapper from '../components/PageWrapper'

const features = [
  {
    icon: '📊',
    title: 'Real-Time Prices',
    desc: 'Get live mandi prices from across Karnataka and nearby markets.',
  },
  {
    icon: '📱',
    title: 'SMS Alerts',
    desc: 'Receive instant SMS when your crop fetches a better price at another mandi.',
  },
  {
    icon: '🗺️',
    title: 'Compare Mandis',
    desc: 'Compare prices across multiple mandis and choose where to sell.',
  },
  {
    icon: '📈',
    title: 'Price Trends',
    desc: 'Track how prices move over time and plan your harvest schedule.',
  },
  {
    icon: '🌱',
    title: 'Multiple Crops',
    desc: 'Supports Tomato, Onion, Potato, Rice, Maize, Groundnut and more.',
  },
  {
    icon: '🔔',
    title: 'Auto Notifications',
    desc: 'Automatic alerts run every 6 hours so you never miss a good price.',
  },
]

export default function LandingPage() {
  return (
    <PageWrapper>
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-green-600 via-green-700 to-green-800 text-white">
        {/* Background pattern */}
        <div className="absolute inset-0 opacity-10"
          style={{ backgroundImage: 'radial-gradient(circle at 20% 50%, white 1px, transparent 1px), radial-gradient(circle at 80% 20%, white 1px, transparent 1px)', backgroundSize: '60px 60px' }}
        />

        <div className="relative max-w-5xl mx-auto px-6 py-24 text-center">
          <motion.div
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5, type: 'spring' }}
            className="text-7xl mb-6"
          >
            🌾
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="font-display text-5xl md:text-6xl font-bold mb-5 leading-tight"
          >
            Sell Your Crops at the <br />
            <span className="text-green-200">Best Mandi Price</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-green-100 text-xl max-w-2xl mx-auto mb-10 leading-relaxed"
          >
            MandiAlert watches prices across all mandis and sends you an SMS the moment your crop fetches a better rate — so you always sell at the right place.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="flex flex-col sm:flex-row gap-4 justify-center"
          >
            <Link to="/register">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.97 }}
                className="bg-white text-green-700 font-bold px-8 py-4 rounded-xl text-lg shadow-lg hover:shadow-xl transition-all duration-200"
              >
                Register Free →
              </motion.button>
            </Link>
            <Link to="/dashboard">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.97 }}
                className="border-2 border-white text-white font-semibold px-8 py-4 rounded-xl text-lg hover:bg-white hover:text-green-700 transition-all duration-200"
              >
                View Prices
              </motion.button>
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Stats strip */}
      <section className="bg-white border-y border-green-100">
        <div className="max-w-5xl mx-auto px-6 py-8 grid grid-cols-3 gap-6 text-center">
          {[
            { value: '15+', label: 'Karnataka Mandis' },
            { value: '10+', label: 'Crops Tracked' },
            { value: 'Every 6hr', label: 'Price Updates' },
          ].map((stat, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
            >
              <p className="text-3xl font-bold text-green-700">{stat.value}</p>
              <p className="text-sm text-gray-500 mt-1">{stat.label}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Features Grid */}
      <section className="max-w-5xl mx-auto px-6 py-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="font-display text-3xl font-bold text-gray-900 mb-3">
            Everything a Farmer Needs
          </h2>
          <p className="text-gray-500 max-w-xl mx-auto">
            Simple tools designed for Indian farmers to maximize earnings from every harvest.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {features.map((f, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 25 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08 }}
              whileHover={{ y: -4, transition: { duration: 0.2 } }}
              className="card hover:border-green-300 hover:shadow-md transition-all duration-200"
            >
              <span className="text-4xl mb-4 block">{f.icon}</span>
              <h3 className="font-semibold text-gray-900 mb-2">{f.title}</h3>
              <p className="text-gray-500 text-sm leading-relaxed">{f.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* CTA Banner */}
      <section className="bg-green-700 text-white">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="max-w-3xl mx-auto px-6 py-16 text-center"
        >
          <h2 className="font-display text-4xl font-bold mb-4">
            Ready to Sell Smarter?
          </h2>
          <p className="text-green-200 mb-8 text-lg">
            Join thousands of farmers getting instant price alerts on their phone.
          </p>
          <Link to="/register">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="bg-white text-green-700 font-bold px-10 py-4 rounded-xl text-lg shadow-xl"
            >
              Register Now — It's Free
            </motion.button>
          </Link>
        </motion.div>
      </section>

      {/* Footer */}
      <footer className="bg-white border-t border-green-100 text-center py-6 text-sm text-gray-400">
        © 2025 MandiAlert · Built to empower Indian farmers
      </footer>
    </PageWrapper>
  )
}
