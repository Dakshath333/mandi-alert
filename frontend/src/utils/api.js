import axios from 'axios'

// Base API instance — proxied to backend via Vite
const api = axios.create({
  baseURL: '/api',
  headers: { 'Content-Type': 'application/json' },
})

// ─── Farmer APIs ────────────────────────────────────────────
export const registerFarmer = (data) => api.post('/farmers/register', data)
export const getFarmers = () => api.get('/farmers')
export const getFarmerById = (id) => api.get(`/farmers/${id}`)
export const updateFarmer = (id, data) => api.put(`/farmers/${id}`, data)

// ─── Market APIs ─────────────────────────────────────────────
export const getMarketPrices = (params) => api.get('/market/prices', { params })
export const addMarketPrice = (data) => api.post('/market/add', data)
export const comparePrices = (crop) => api.get('/market/compare', { params: { crop } })
export const getAvailableCrops = () => api.get('/market/crops')
export const updateMarketPrice = (id, data) => api.put(`/market/${id}`, data)

// ─── Alert APIs ──────────────────────────────────────────────
export const getAlerts = () => api.get('/alerts')
export const getFarmerAlerts = (farmerId) => api.get(`/alerts/farmer/${farmerId}`)
export const triggerAlerts = () => api.post('/alerts/trigger')

// ─── Admin APIs ──────────────────────────────────────────────
export const getAdminStats = () => api.get('/admin/stats')
export const seedSampleData = () => api.post('/admin/seed')

export default api
