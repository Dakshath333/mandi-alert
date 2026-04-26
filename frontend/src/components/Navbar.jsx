import { Link, useLocation, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'

export default function Navbar() {
  const { pathname } = useLocation()
  const navigate = useNavigate()
  const farmer = JSON.parse(localStorage.getItem('farmer') || 'null')

  const handleLogout = () => {
    localStorage.removeItem('farmer')
    navigate('/login')
  }

  const links = [
    { to: '/', label: 'Home' },
    { to: '/prices', label: 'Market Prices' },
    ...(farmer ? [{ to: '/dashboard', label: 'My Dashboard' }] : []),
    { to: '/admin', label: 'Admin' },
  ]

  return (
    <motion.nav initial={{ y: -60, opacity: 0 }} animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.4 }}
      className="bg-white border-b border-green-100 sticky top-0 z-50 shadow-sm">
      <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2">
          <span className="text-2xl">🌾</span>
          <span className="font-display text-xl font-bold text-green-700">MandiAlert</span>
        </Link>
        <div className="flex items-center gap-1">
          {links.map(link => (
            <Link key={link.to} to={link.to}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-150 ${
                pathname === link.to
                  ? 'bg-green-100 text-green-700'
                  : 'text-gray-600 hover:text-green-700 hover:bg-green-50'
              }`}>
              {link.label}
            </Link>
          ))}
          {farmer ? (
            <div className="flex items-center gap-2 ml-2">
              <span className="text-xs text-gray-500 hidden sm:block">Hi, {farmer.name.split(' ')[0]}</span>
              <button onClick={handleLogout}
                className="text-xs border border-red-200 text-red-500 hover:bg-red-50 px-3 py-1.5 rounded-lg transition-colors">
                Logout
              </button>
            </div>
          ) : (
            <Link to="/login" className="ml-2 btn-primary !px-4 !py-2">Login</Link>
          )}
        </div>
      </div>
    </motion.nav>
  )
}
