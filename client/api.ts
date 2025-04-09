// API configuration for connecting to backend services
const BASE_URL = process.env.VITE_API_BASE_URL || 'http://localhost:5000/api';

// Configure default request options
const DEFAULT_HEADERS = {
  'Content-Type': 'application/json',
  'Accept': 'application/json'
};

// Configure request timeout and retry settings
const REQUEST_TIMEOUT = 30000;
const MAX_RETRIES = 3;
const RETRY_DELAY = 1000;

// Helper function to add authentication token
const getAuthHeaders = () => {
  const token = localStorage.getItem('authToken');
  return token ? { ...DEFAULT_HEADERS, 'Authorization': `Bearer ${token}` } : DEFAULT_HEADERS;
};

// Helper function to handle API errors
const handleApiError = async (response: Response, endpoint: string) => {
  let errorMessage = `Request to ${endpoint} failed`;
  try {
    const errorData = await response.json();
    errorMessage = errorData.message || errorMessage;
  } catch {}
  throw new Error(`${errorMessage} (${response.status}: ${response.statusText})`);
};

// Helper function to implement retry logic
const fetchWithRetry = async (url: string, options: RequestInit, retries = MAX_RETRIES): Promise<Response> => {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), REQUEST_TIMEOUT);

    const response = await fetch(url, {
      ...options,
      signal: controller.signal
    });

    clearTimeout(timeoutId);
    return response;
  } catch (error) {
    if (error instanceof Error && error.name === 'AbortError') {
      throw new Error(`Request timeout after ${REQUEST_TIMEOUT}ms`);
    }
    if (retries > 0) {
      await new Promise(resolve => setTimeout(resolve, RETRY_DELAY));
      return fetchWithRetry(url, options, retries - 1);
    }
    throw error;
  }
};

export async function apiGet(endpoint: string) {
  const response = await fetchWithRetry(`${BASE_URL}${endpoint}`, {
    headers: getAuthHeaders()
  });
  
  if (!response.ok) {
    await handleApiError(response, endpoint);
  }
  return response.json();
}

export async function apiPost(endpoint: string, data: any) {
  const response = await fetchWithRetry(`${BASE_URL}${endpoint}`, {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify(data)
  });

  if (!response.ok) {
    await handleApiError(response, endpoint);
  }
  return response.json();
}
