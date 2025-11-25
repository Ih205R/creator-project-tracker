import axios from 'axios';
import { auth } from './firebase';

// Get the API base URL
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001';
console.log('🌐 API Base URL:', API_BASE_URL);

const api = axios.create({
  baseURL: `${API_BASE_URL}/api`,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add auth token to requests
api.interceptors.request.use(async (config) => {
  const fullURL = `${config.baseURL}${config.url}`;
  console.log('📤 API Request:', config.method?.toUpperCase(), fullURL);
  
  const user = auth.currentUser;
  if (user) {
    const token = await user.getIdToken();
    config.headers.Authorization = `Bearer ${token}`;
    console.log('🔑 Added auth token for user:', user.email);
  } else {
    console.warn('⚠️ No authenticated user found');
  }
  return config;
});

// Handle errors
api.interceptors.response.use(
  (response) => {
    console.log('✅ API Response:', response.status, response.config.url);
    return response;
  },
  (error) => {
    const status = error.response?.status;
    const url = error.config?.url;
    console.error('❌ API Error:', status, url, error.response?.data || error.message);
    
    if (status === 401) {
      // Redirect to login
      if (typeof window !== 'undefined') {
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

export default api;

// API methods
export const projectsAPI = {
  getAll: () => api.get('/projects'),
  getOne: (id) => api.get(`/projects/${id}`),
  create: (data) => api.post('/projects', data),
  update: (id, data) => api.put(`/projects/${id}`, data),
  delete: (id) => api.delete(`/projects/${id}`),
  updateOrder: (updates) => api.post('/projects/order', { updates }),
};

export const brandDealsAPI = {
  // Main CRUD
  getAll: (params = {}) => api.get('/brand-deals', { params }),
  getOne: (id) => api.get(`/brand-deals/${id}`),
  create: (data) => api.post('/brand-deals', data),
  update: (id, data) => api.put(`/brand-deals/${id}`, data),
  delete: (id) => api.delete(`/brand-deals/${id}`),
  getStats: () => api.get('/brand-deals/stats'),
  
  // Stage management
  updateStage: (id, stage) => api.put(`/brand-deals/${id}/stage`, { stage }),
  
  // Deliverables
  addDeliverable: (id, data) => api.post(`/brand-deals/${id}/deliverables`, data),
  updateDeliverable: (id, deliverableId, data) => 
    api.put(`/brand-deals/${id}/deliverables/${deliverableId}`, data),
  deleteDeliverable: (id, deliverableId) => 
    api.delete(`/brand-deals/${id}/deliverables/${deliverableId}`),
  
  // Documents
  getDocuments: (id) => api.get(`/brand-deals/${id}/documents`),
  addDocument: (id, data) => api.post(`/brand-deals/${id}/documents`, data),
  deleteDocument: (id, documentId) => 
    api.delete(`/brand-deals/${id}/documents/${documentId}`),
  
  // Payments
  addPayment: (id, data) => api.post(`/brand-deals/${id}/payments`, data),
  updatePayment: (id, paymentId, data) => 
    api.put(`/brand-deals/${id}/payments/${paymentId}`, data),
  
  // Communications
  getCommunications: (id) => api.get(`/brand-deals/${id}/communications`),
  addCommunication: (id, data) => api.post(`/brand-deals/${id}/communications`, data),
  
  // AI Insights
  addInsight: (id, data) => api.post(`/brand-deals/${id}/insights`, data),
};

export const calendarAPI = {
  getItems: (startDate, endDate) => 
    api.get('/calendar', { params: { startDate, endDate } }),
  create: (data) => api.post('/calendar', data),
  update: (id, data) => api.put(`/calendar/${id}`, data),
  delete: (id) => api.delete(`/calendar/${id}`),
};

export const aiAPI = {
  generateCaptions: (data) => api.post('/ai/captions', data),
  generateTitles: (data) => api.post('/ai/titles', data),
  generateScript: (data) => api.post('/ai/script', data),
  generateAll: (data) => api.post('/ai/all', data),
};

export const stripeAPI = {
  createCheckoutSession: (priceId) => 
    api.post('/stripe/create-checkout-session', { priceId }),
  createPortalSession: () => api.post('/stripe/create-portal-session'),
  getSubscriptionStatus: () => api.get('/stripe/subscription-status'),
};

export const userAPI = {
  getProfile: async () => {
    console.log('📡 API: Fetching user profile...');
    const response = await api.get('/user/profile');
    console.log('📡 API: Profile response:', {
      status: response.status,
      data: response.data,
      user: {
        email: response.data?.user?.email,
        role: response.data?.user?.role,
        subscriptionStatus: response.data?.user?.subscriptionStatus,
        subscriptionPlan: response.data?.user?.subscriptionPlan
      }
    });
    return response;
  },
  updateProfile: (data) => api.put('/user/profile', data),
  updatePushToken: (token) => api.post('/user/push-token', { token }),
  removePushToken: (token) => api.delete('/user/push-token', { data: { token } }),
  getStats: () => api.get('/user/stats'),
};

export const notificationsAPI = {
  getAll: (unreadOnly = false) => 
    api.get('/notifications', { params: { unreadOnly } }),
  markAsRead: (id) => api.put(`/notifications/${id}/read`),
  markAllAsRead: () => api.put('/notifications/read-all'),
  delete: (id) => api.delete(`/notifications/${id}`),
};
