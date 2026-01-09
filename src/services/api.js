// API Configuration with dynamic port discovery
const PRODUCTION_API_URL = 'https://interview-app-mtqo.onrender.com/api';
const DEFAULT_BASE = import.meta.env.VITE_API_URL || (import.meta.env.DEV ? 'http://localhost:5000/api' : PRODUCTION_API_URL);
const PORT_RANGE = [5000, 5001, 5002, 5003, 5004, 5005];
let discovering = null;

async function probePort(port, signal) {
  const controller = new AbortController();
  if (signal) signal.addEventListener('abort', () => controller.abort());
  const url = `http://localhost:${port}/api/health`;
  try {
    const res = await fetch(url, { method: 'GET', signal: controller.signal, cache: 'no-store' });
    if (!res.ok) return null;
    const json = await res.json().catch(() => ({}));
    if (json && json.status === 'success') return `http://localhost:${port}/api`;
  } catch { /* ignore */ }
  return null;
}

async function discoverBaseURL(timeoutMs = 2500) {
  // Returns configured URL or falls back to production URL
  const envUrl = import.meta.env.VITE_API_URL;
  if (envUrl) return envUrl;

  // If in production, use the Render backend
  if (!import.meta.env.DEV) {
    return PRODUCTION_API_URL;
  }

  // Fallback for local development if VITE_API_URL not set
  return 'http://localhost:5000/api';
}

class ApiService {
  constructor() {
    this.baseURL = DEFAULT_BASE;
    this.failedOnce = false;
  }

  async ensureBaseURL() {
    // If previous request failed due to network, attempt discovery
    if (this.failedOnce) {
      this.baseURL = await discoverBaseURL();
      this.failedOnce = false;
    }
  }

  // Generic request method with auto-discovery retry
  async request(endpoint, options = {}) {
    await this.ensureBaseURL();
    const url = `${this.baseURL}${endpoint}`;

    const config = {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    };

    try {
      const response = await fetch(url, config);
      const contentType = response.headers.get('content-type') || '';
      const payload = contentType.includes('application/json') ? await response.json().catch(() => ({})) : await response.text();
      if (!response.ok) {
        const message = (payload && payload.message) || (typeof payload === 'string' ? payload : `HTTP ${response.status}`);
        const error = new Error(message);
        error.status = response.status;
        error.payload = payload;
        throw error;
      }
      return payload;
    } catch (error) {
      if (error.name === 'TypeError' && /Failed to fetch/i.test(error.message)) {
        // Mark failure & attempt one rediscovery retry
        if (!this.failedOnce) {
          this.failedOnce = true;
          try {
            await this.ensureBaseURL();
            // retry once
            return await this.request(endpoint, options);
          } catch {/* ignore */ }
        }
        error.message = 'Cannot reach server. Is backend running?';
      }
      console.error('API request failed:', error);
      throw error;
    }
  }

  // GET request
  async get(endpoint, params = {}) {
    const queryString = new URLSearchParams(params).toString();
    const url = queryString ? `${endpoint}?${queryString}` : endpoint;

    return this.request(url);
  }

  // POST request
  async post(endpoint, data) {
    return this.request(endpoint, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  // PUT request
  async put(endpoint, data) {
    return this.request(endpoint, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  // PATCH request
  async patch(endpoint, data) {
    return this.request(endpoint, {
      method: 'PATCH',
      body: JSON.stringify(data),
    });
  }

  // DELETE request
  async delete(endpoint) {
    return this.request(endpoint, {
      method: 'DELETE',
    });
  }

  // Health check
  async healthCheck() {
    return this.get('/health');
  }
}

export default new ApiService();
