export const ACCESS_TOKEN_KEY = 'auth_access';
export const REFRESH_TOKEN_KEY = 'auth_refresh';
export const USER_KEY = 'auth_user';

export function isAuthenticated(): boolean {
  return Boolean(getAccessToken());
}

export function setAuthTokens({ accessToken, refreshToken }: { accessToken: string; refreshToken: string }) {
  localStorage.setItem(ACCESS_TOKEN_KEY, accessToken);
  localStorage.setItem(REFRESH_TOKEN_KEY, refreshToken);
}

export function getAccessToken(): string | null {
  return localStorage.getItem(ACCESS_TOKEN_KEY);
}

export function getRefreshToken(): string | null {
  return localStorage.getItem(REFRESH_TOKEN_KEY);
}

export type SafeUser = { id: number; email: string; name?: string };

export function setUser(user: SafeUser) {
  localStorage.setItem(USER_KEY, JSON.stringify(user));
}

export function getUser(): SafeUser | null {
  const raw = localStorage.getItem(USER_KEY);
  if (!raw) return null;
  try {
    return JSON.parse(raw) as SafeUser;
  } catch {
    return null;
  }
}

export function clearAuth() {
  localStorage.removeItem(ACCESS_TOKEN_KEY);
  localStorage.removeItem(REFRESH_TOKEN_KEY);
  localStorage.removeItem(USER_KEY);
}
