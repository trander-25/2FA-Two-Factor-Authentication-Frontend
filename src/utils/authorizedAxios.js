import axios from 'axios'
import { toast } from 'react-toastify'

// Custom axios instance with default configurations
let authorizedAxiosInstance = axios.create()
// Request timeout: 10 minutes
authorizedAxiosInstance.defaults.timeout = 1000 * 60 * 10
// Enable cookies for JWT token authentication
authorizedAxiosInstance.defaults.withCredentials = true

// Request interceptor
authorizedAxiosInstance.interceptors.request.use((config) => {
  return config
}, (error) => {
  return Promise.reject(error)
})

// Response interceptor
authorizedAxiosInstance.interceptors.response.use((response) => {
  // Any status code that lie within the range of 2xx cause this function to trigger
  return response
}, (error) => {
  // Any status codes that falls outside the range of 2xx cause this function to trigger
  // Centralized error handling with toast notifications
  // Skip 410 status (used for token refresh)
  if (error.response?.status !== 410) {
    toast.error(error.response?.data?.message || error?.message)
  }

  return Promise.reject(error)
})

export default authorizedAxiosInstance
