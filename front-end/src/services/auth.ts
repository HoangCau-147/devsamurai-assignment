import API from './api';
import * as Auth from '@/lib/auth';
import axios from 'axios';
export interface SignupDto {
  name: string;
  email: string;
  password: string;
}

export interface LoginDto {
  email: string;
  password: string;
}

export async function signup(dto: SignupDto) {
  try {
    const res = await API.post('/auth/signup', dto);
    const { user, accessToken, refreshToken } = res.data;
    Auth.setAuthTokens({ accessToken, refreshToken });
    Auth.setUser(user);
    return { user };
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const message = error.response?.data?.message || 'Registration failed';
      throw new Error(
        Array.isArray(message) ? message.join(', ') : message
      );
    }
    throw new Error('Network error. Please try again.');
  }
}

export async function login(dto: LoginDto) {
  try {
    const res = await API.post('/auth/login', dto);
    const { user, accessToken, refreshToken } = res.data;
    Auth.setAuthTokens({ accessToken, refreshToken });
    Auth.setUser(user);
    window.dispatchEvent(new Event('userChanged'));
    return { user };
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const message = error.response?.data?.message || 'Invalid email or password';
      throw new Error(
        Array.isArray(message) ? message.join(', ') : message
      );
    }
    throw new Error('Network error. Please try again.');
  }
}

export async function refresh() {
  const refreshToken = Auth.getRefreshToken();
  if (!refreshToken) throw new Error('No refresh token');
  const res = await API.post('/auth/refresh', { refreshToken });
  const { accessToken, refreshToken: newRefresh } = res.data;
  Auth.setAuthTokens({ accessToken, refreshToken: newRefresh });
  return { accessToken, refreshToken: newRefresh };
}

export async function me() {
  const res = await API.get('/auth/me');
  return res.data;
}

export function logout() {
  Auth.clearAuth();
}
