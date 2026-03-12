const API_BASE = '/api';

const api = {
  getToken() {
    return localStorage.getItem('agp_token');
  },

  setToken(token) {
    if (token) localStorage.setItem('agp_token', token);
  },

  clearToken() {
    localStorage.removeItem('agp_token');
  },

  getUser() {
    const raw = localStorage.getItem('agp_user');
    return raw ? JSON.parse(raw) : null;
  },

  setUser(user) {
    localStorage.setItem('agp_user', JSON.stringify(user));
  },

  clearUser() {
    localStorage.removeItem('agp_user');
  },

  async request(path, options = {}) {
    const token = this.getToken();
    const headers = {
      'Content-Type': 'application/json',
      ...(options.headers || {})
    };

    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }

    const response = await fetch(`${API_BASE}${path}`, {
      ...options,
      headers
    });

    const isJson = response.headers.get('content-type')?.includes('application/json');
    const data = isJson ? await response.json() : {};

    if (!response.ok) {
      throw new Error(data.error || data.message || 'Request failed');
    }

    return data;
  },

  async uploadFile(file) {
    const formData = new FormData();
    formData.append('file', file);

    const response = await fetch('/api/upload', {
      method: 'POST',
      body: formData
    });

    const data = await response.json();
    if (!response.ok) throw new Error(data.error || 'Upload failed');
    return data;
  }
};
