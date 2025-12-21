import { useEffect, useState } from "react";
import type React from 'react';
import { Link, useNavigate } from "react-router-dom";

import { isAuthenticated } from "../lib/auth";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function AuthPage() {
  const navigate = useNavigate();
  const [currentTab, setCurrentTab] = useState<"login" | "signup">("login");

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isAuthenticated()) {
      navigate("/");
    }
  }, [navigate]);

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const { login } = await import('../services/auth');
      await login({ email, password });
      navigate('/');
    } catch (err: any) {
      setError(err?.message ?? 'Login failed');
    } finally {
      setLoading(false);
    }
  }

  async function handleSignup(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const { signup } = await import('../services/auth');
      await signup({ name, email, password });
      navigate('/');
    } catch (err: any) {
      setError(err?.message ?? 'Signup failed');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="w-screen h-screen flex flex-col items-center py-12">
      <Link to="/" className="flex items-center mb-6">
        <div className="flex size-7 items-center justify-center rounded-md border text-primary-foreground bg-primary m-1">
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <g>
              <path
                d="M7.81815 8.36373L12 0L24 24H15.2809L7.81815 8.36373Z"
                fill="currentColor"
              ></path>
              <path
                d="M4.32142 15.3572L8.44635 24H-1.14809e-06L4.32142 15.3572Z"
                fill="currentColor"
              ></path>
            </g>
          </svg>
        </div>

        <span className="font-bold">Acme</span>
      </Link>

      {currentTab === "signup" && (
        <Card className="w-full max-w-sm py-8 px-4">
          <CardHeader>
            <CardTitle>Create your account</CardTitle>
            <CardDescription>
              Please fill in the details to get started.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSignup}>
              <div className="flex flex-col gap-6">
                <div className="grid gap-2">
                  <Label htmlFor="name">Name</Label>
                  <Input
                    id="name"
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    icon={
                      <svg
                        className="w-4 h-4 text-muted-foreground"
                        viewBox="0 0 24 24"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                        aria-hidden
                      >
                        <path
                          d="M12 12c2.761 0 5-2.239 5-5s-2.239-5-5-5-5 2.239-5 5 2.239 5 5 5z"
                          stroke="currentColor"
                          strokeWidth="1.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                        <path
                          d="M4 20c0-4 4-6 8-6s8 2 8 6"
                          stroke="currentColor"
                          strokeWidth="1.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    }
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    icon={
                      <svg
                        className="w-4 h-4 text-muted-foreground"
                        viewBox="0 0 24 24"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                        aria-hidden
                      >
                        <path
                          d="M3 8l9 6 9-6"
                          stroke="currentColor"
                          strokeWidth="1.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                        <rect
                          x="3"
                          y="5"
                          width="18"
                          height="14"
                          rx="2"
                          stroke="currentColor"
                          strokeWidth="1.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    }
                  />
                </div>
                <div className="grid gap-2">
                  <div className="flex items-center">
                    <Label htmlFor="password">Password</Label>
                  </div>
                  <Input
                    id="password"
                    variant="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    icon={
                      <svg
                        className="w-4 h-4 text-muted-foreground"
                        viewBox="0 0 24 24"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                        aria-hidden
                      >
                        <rect
                          x="3"
                          y="10"
                          width="18"
                          height="10"
                          rx="2"
                          stroke="currentColor"
                          strokeWidth="1.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                        <path
                          d="M7 10V8a5 5 0 0 1 10 0v2"
                          stroke="currentColor"
                          strokeWidth="1.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    }
                  />
                </div>
              </div>
            </form>
            {error && <p className="text-sm text-red-600 mt-2">{error}</p>}
          </CardContent>
          <CardFooter className="flex-col gap-4">
            <Button type="button" className="w-full" disabled={loading} onClick={handleSignup}>
              {loading ? 'Creating...' : 'Create account'}
            </Button>

            <div className="w-full flex items-center text-sm text-muted-foreground before:flex-1 before:border-t before:border-gray-200 before:me-6 after:flex-1 after:border-t after:border-gray-200 after:ms-6 dark:text-neutral-500 dark:before:border-neutral-600 dark:after:border-neutral-600">Or continue with</div>

            <div className="flex gap-2 w-full">
              <Button
                variant="outline"
                className="flex-1 flex items-center justify-center gap-2"
              >
                <svg
                  className="w-4 h-4"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  aria-hidden
                >
                  <path
                    d="M21.6 12.2275c0-.68-.06-1.3333-.1733-1.96H12v3.7233h5.8467c-.252 1.36-1.02 2.5125-2.1734 3.2875v2.7242h3.5134c2.058-1.896 3.2133-4.6933 3.2133-8.0175z"
                    fill="#4285F4"
                  />
                  <path
                    d="M12 22c2.97 0 5.46-.98 7.28-2.66l-3.5134-2.7242c-.98.66-2.24 1.05-3.7666 1.05-2.89 0-5.3425-1.95-6.2166-4.5742H2.1134v2.87C3.93 19.94 7.75 22 12 22z"
                    fill="#34A853"
                  />
                  <path
                    d="M5.7833 13.095c-.22-.66-.3467-1.365-.3467-2.095s.1267-1.435.3467-2.095v-2.87H2.1134A9.997 9.997 0 0 0 2 12c0 1.61.3884 3.1333 1.1134 4.47l2.67-3.375z"
                    fill="#FBBC05"
                  />
                  <path
                    d="M12 6.48c1.66 0 3.16.57 4.35 1.69l3.26-3.26C17.46 2.98 14.97 2 12 2 7.75 2 3.93 4.06 2.1134 6.45l3.67 2.87C6.6575 8.43 9.11 6.48 12 6.48z"
                    fill="#EA4335"
                  />
                </svg>
                Google
              </Button>
              <Button
                variant="outline"
                className="flex-1 flex items-center justify-center gap-2"
              >
                <svg
                  className="w-4 h-4"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  aria-hidden
                >
                  <rect x="2" y="2" width="9" height="9" fill="#F35325" />
                  <rect x="13" y="2" width="9" height="9" fill="#81BC06" />
                  <rect x="2" y="13" width="9" height="9" fill="#05A6F0" />
                  <rect x="13" y="13" width="9" height="9" fill="#FFBA08" />
                </svg>
                Microsoft
              </Button>
            </div>

            <p className="text-sm text-center text-muted-foreground w-full mt-2">
              Already have an account?{" "}
              <button
                type="button"
                onClick={() => setCurrentTab("login")}
                className="underline hover:cursor-pointer text-black"
              >
                Sign in
              </button>
            </p>
          </CardFooter>
        </Card>
      )}

      {currentTab === "login" && (
        <Card className="w-full max-w-sm py-8 px-4">
          <CardHeader>
            <CardTitle>Sign in to your account</CardTitle>
            <CardDescription>
              Welcome back! Please sign in to continue.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLogin}>
              <div className="flex flex-col gap-6">
                <div className="grid gap-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    icon={
                      <svg
                        className="w-4 h-4 text-muted-foreground"
                        viewBox="0 0 24 24"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                        aria-hidden
                      >
                        <path
                          d="M3 8l9 6 9-6"
                          stroke="currentColor"
                          strokeWidth="1.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                        <rect
                          x="3"
                          y="5"
                          width="18"
                          height="14"
                          rx="2"
                          stroke="currentColor"
                          strokeWidth="1.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    }
                  />
                </div>
                <div className="grid gap-2">
                  <div className="flex items-center">
                    <Label htmlFor="password">Password</Label>
                    <a
                      href="#"
                      className="ml-auto inline-block text-sm underline hover:cursor-pointer text-black-offset-4"
                    >
                      Forgot your password?
                    </a>
                  </div>
                  <Input
                    id="password"
                    variant="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    icon={
                      <svg
                        className="w-4 h-4 text-muted-foreground"
                        viewBox="0 0 24 24"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                        aria-hidden
                      >
                        <rect
                          x="3"
                          y="10"
                          width="18"
                          height="10"
                          rx="2"
                          stroke="currentColor"
                          strokeWidth="1.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                        <path
                          d="M7 10V8a5 5 0 0 1 10 0v2"
                          stroke="currentColor"
                          strokeWidth="1.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    }
                  />
                </div>
              </div>
            </form>
            {error && <p className="text-sm text-red-600 mt-2">{error}</p>}
          </CardContent>
          <CardFooter className="flex-col gap-4">
            <Button type="button" className="w-full" disabled={loading} onClick={handleLogin}>
              {loading ? 'Signing in...' : 'Sign in'}
            </Button>

            <div className="w-full flex items-center text-sm text-muted-foreground before:flex-1 before:border-t before:border-gray-200 before:me-6 after:flex-1 after:border-t after:border-gray-200 after:ms-6 dark:text-neutral-500 dark:before:border-neutral-600 dark:after:border-neutral-600">Or continue with</div>

            <div className="flex gap-2 w-full">
              <Button
                variant="outline"
                className="flex-1 flex items-center justify-center gap-2"
              >
                <svg
                  className="w-4 h-4"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  aria-hidden
                >
                  <path
                    d="M21.6 12.2275c0-.68-.06-1.3333-.1733-1.96H12v3.7233h5.8467c-.252 1.36-1.02 2.5125-2.1734 3.2875v2.7242h3.5134c2.058-1.896 3.2133-4.6933 3.2133-8.0175z"
                    fill="#4285F4"
                  />
                  <path
                    d="M12 22c2.97 0 5.46-.98 7.28-2.66l-3.5134-2.7242c-.98.66-2.24 1.05-3.7666 1.05-2.89 0-5.3425-1.95-6.2166-4.5742H2.1134v2.87C3.93 19.94 7.75 22 12 22z"
                    fill="#34A853"
                  />
                  <path
                    d="M5.7833 13.095c-.22-.66-.3467-1.365-.3467-2.095s.1267-1.435.3467-2.095v-2.87H2.1134A9.997 9.997 0 0 0 2 12c0 1.61.3884 3.1333 1.1134 4.47l2.67-3.375z"
                    fill="#FBBC05"
                  />
                  <path
                    d="M12 6.48c1.66 0 3.16.57 4.35 1.69l3.26-3.26C17.46 2.98 14.97 2 12 2 7.75 2 3.93 4.06 2.1134 6.45l3.67 2.87C6.6575 8.43 9.11 6.48 12 6.48z"
                    fill="#EA4335"
                  />
                </svg>
                Google
              </Button>
              <Button
                variant="outline"
                className="flex-1 flex items-center justify-center gap-2"
              >
                <svg
                  className="w-4 h-4"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  aria-hidden
                >
                  <rect x="2" y="2" width="9" height="9" fill="#F35325" />
                  <rect x="13" y="2" width="9" height="9" fill="#81BC06" />
                  <rect x="2" y="13" width="9" height="9" fill="#05A6F0" />
                  <rect x="13" y="13" width="9" height="9" fill="#FFBA08" />
                </svg>
                Microsoft
              </Button>
            </div>

            <p className="text-sm text-center text-muted-foreground w-full mt-2">
              Don't have an account?{" "}
              <button
                type="button"
                onClick={() => setCurrentTab("signup")}
                className="underline hover:cursor-pointer text-black"
              >
                Sign up
              </button>
            </p>
          </CardFooter>
        </Card>
      )}

      {currentTab === "signup" && (
        <div className="px-2 text-xs text-muted-foreground max-w-sm my-6">
          By signing up, you agree to our{" "}
          <a
            className="text-foreground underline"
            href="https://demo.achromatic.dev/terms-of-use"
          >
            Terms of Use
          </a>{" "}
          and{" "}
          <a
            className="text-foreground underline"
            href="https://demo.achromatic.dev/privacy-policy"
          >
            Privacy Policy
          </a>
          . Need help?{" "}
          <a
            className="text-foreground underline"
            href="https://demo.achromatic.dev/contact"
          >
            Get in touch
          </a>
          .
        </div>
      )}
    </div>
  );
}
