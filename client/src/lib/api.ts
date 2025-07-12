import { auth } from '@/lib/firebase';

export async function getAuthToken(): Promise<string | null> {
  try {
    const user = auth.currentUser;
    if (!user) return null;
    
    return await user.getIdToken();
  } catch (error) {
    console.error('Error getting auth token:', error);
    return null;
  }
}

export async function fetchWithAuth(url: string, options: RequestInit = {}): Promise<Response> {
  const token = await getAuthToken();
  
  const headers = new Headers(options.headers || {});
  if (token) {
    headers.set('Authorization', `Bearer ${token}`);
  }
  headers.set('Content-Type', 'application/json');
  
  return fetch(url, {
    ...options,
    headers,
  });
}

export const apiClient = {
  get: (url: string) => fetchWithAuth(url),
  post: (url: string, data: any) => fetchWithAuth(url, {
    method: 'POST',
    body: JSON.stringify(data),
  }),
  put: (url: string, data: any) => fetchWithAuth(url, {
    method: 'PUT',
    body: JSON.stringify(data),
  }),
  delete: (url: string) => fetchWithAuth(url, {
    method: 'DELETE',
  }),
};
