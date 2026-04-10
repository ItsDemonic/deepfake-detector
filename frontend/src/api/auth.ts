import { apiClient } from './client';
import type { AuthTokens, User } from '../types';

export async function signup(username: string, email: string, password: string): Promise<{ message: string }> {
  const res = await apiClient.post('/auth/signup', { username, email, password });
  return res.data;
}

export async function login(username: string, password: string): Promise<AuthTokens> {
  const params = new URLSearchParams();
  params.append('username', username);
  params.append('password', password);
  const res = await apiClient.post('/auth/login', params, {
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
  });
  return res.data;
}

export async function getMe(): Promise<User> {
  const res = await apiClient.get('/user');
  return res.data;
}
