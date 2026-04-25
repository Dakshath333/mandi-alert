import axios from 'axios'

const api = axios.create({ baseURL: '/api', headers: { 'Content-Type': 'application/json' } })

// Farmers
export const registerFarmer = (data) => api.post('/farmers/register', data)
export const loginFarmer = (data) => api.post('/farmers/login', data)
export const getFarmers = () => api.get('/farmers')
export const getFarmerById = (id) => api.get(`/farmers/${id}`)
export const updateFarmer = (id, data) => api.put(`/farmers/${id}`, data)

// Market — AG Market style
export const getMarketPrices = (params) => api.get('/market/prices', { params })
export const addMarketPrice = (data) => api.post('/market/add', data)
export const comparePrices = (params) => api.get('/market/compare', { params })
export const getFilters = () => api.get('/market/filters')
export const getDistricts = (state) => api.get('/market/districts', { params: { state } })
export const getMandis = (district, state) => api.get('/market/mandis', { params: { district, state } })

// Alerts
export const getAlerts = () => api.get('/alerts')
export const getFarmerAlerts = (id) => api.get(`/alerts/farmer/${id}`)
export const triggerAlerts = () => api.post('/alerts/trigger')

// Admin
export const getAdminStats = () => api.get('/admin/stats')
export const seedSampleData = () => api.post('/admin/seed')

export default api
