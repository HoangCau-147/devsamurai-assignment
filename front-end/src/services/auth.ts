import API from './api';
import * as Auth from '@/lib/auth';

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
  const res = await API.post('/auth/signup', dto);
  const { user, accessToken, refreshToken } = res.data;
  Auth.setAuthTokens({ accessToken, refreshToken });
  Auth.setUser(user);
  return { user };
}

export async function login(dto: LoginDto) {
  const res = await API.post('/auth/login', dto);
  const { user, accessToken, refreshToken } = res.data;
  Auth.setAuthTokens({ accessToken, refreshToken });
  Auth.setUser(user);
  return { user };
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
