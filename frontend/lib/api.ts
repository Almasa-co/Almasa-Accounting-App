import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

// Ensure API_URL doesn't end with /api to avoid double /api/api
const baseURL = API_URL.endsWith('/api')
    ? API_URL
    : `${API_URL}/api`;

const api = axios.create({
    baseURL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Add token to requests
api.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

// Handle responses and errors
api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            window.location.href = '/';
        }
        return Promise.reject(error);
    }
);

export default api;

// Auth API
export const authAPI = {
    register: (data: any) => api.post('/auth/register', data),
    login: (data: any) => api.post('/auth/login', data),
    me: () => api.get('/auth/me'),
};

// Customers API
export const customersAPI = {
    getAll: (search?: string) => api.get('/customers', { params: { search } }),
    getOne: (id: string) => api.get(`/customers/${id}`),
    create: (data: any) => api.post('/customers', data),
    update: (id: string, data: any) => api.put(`/customers/${id}`, data),
    delete: (id: string) => api.delete(`/customers/${id}`),
};

// Vendors API
export const vendorsAPI = {
    getAll: (search?: string) => api.get('/vendors', { params: { search } }),
    getOne: (id: string) => api.get(`/vendors/${id}`),
    create: (data: any) => api.post('/vendors', data),
    update: (id: string, data: any) => api.put(`/vendors/${id}`, data),
    delete: (id: string) => api.delete(`/vendors/${id}`),
};

// Invoices API
export const invoicesAPI = {
    getAll: (status?: string, search?: string) =>
        api.get('/invoices', { params: { status, search } }),
    getOne: (id: string) => api.get(`/invoices/${id}`),
    create: (data: any) => api.post('/invoices', data),
    update: (id: string, data: any) => api.put(`/invoices/${id}`, data),
    updateStatus: (id: string, status: string) =>
        api.patch(`/invoices/${id}/status`, { status }),
    delete: (id: string) => api.delete(`/invoices/${id}`),
};

// Expenses API
export const expensesAPI = {
    getAll: (categoryId?: string, search?: string) =>
        api.get('/expenses', { params: { categoryId, search } }),
    getOne: (id: string) => api.get(`/expenses/${id}`),
    create: (data: any) => api.post('/expenses', data),
    update: (id: string, data: any) => api.put(`/expenses/${id}`, data),
    delete: (id: string) => api.delete(`/expenses/${id}`),
};

// Expense Categories API
export const expenseCategoriesAPI = {
    getAll: () => api.get('/expense-categories'),
    create: (data: any) => api.post('/expense-categories', data),
    update: (id: string, data: any) => api.put(`/expense-categories/${id}`, data),
};

// Dashboard API
export const dashboardAPI = {
    getStats: () => api.get('/dashboard/stats'),
};

// Taxes API
export const taxesAPI = {
    getAll: () => api.get('/taxes'),
    create: (data: any) => api.post('/taxes', data),
};

// Currencies API
export const currenciesAPI = {
    getAll: () => api.get('/currencies'),
};

// Payments API
export const paymentsAPI = {
    create: (data: any) => api.post('/payments', data),
    getByInvoice: (invoiceId: string) => api.get(`/payments/invoice/${invoiceId}`),
};

// Reports API
export const reportsAPI = {
    profitLoss: (startDate?: string, endDate?: string) =>
        api.get('/reports/profit-loss', { params: { startDate, endDate } }),
    incomeSummary: (startDate?: string, endDate?: string) =>
        api.get('/reports/income-summary', { params: { startDate, endDate } }),
    expenseSummary: (startDate?: string, endDate?: string) =>
        api.get('/reports/expense-summary', { params: { startDate, endDate } }),
};
