import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { CircleCheck, CircleX } from "lucide-react";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Button } from "./ui/button";
import { Spinner } from "./ui/spinner";

const passwordRules = [
  {
    key: "minLength",
    test: (pwd: string) => pwd.length >= 8,
    message: "8 or more characters",
  },
  {
    key: "uppercase",
    test: (pwd: string) => /[A-Z]/.test(pwd) && /[a-z]/.test(pwd),
    message: "Uppercase or lowercase letters",
  },
];

function Signup({
  setCurrentTab,
}: {
  setCurrentTab: React.Dispatch<React.SetStateAction<"login" | "signup">>;
}) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const [nameError, setNameError] = useState<string | null>(null);
  const [emailError, setEmailError] = useState<string | null>(null);
  const [passwordError, setPasswordError] = useState<string | null>(null);

  const navigate = useNavigate();

  const failedRules = passwordRules.filter((rule) => !rule.test(password));
  const firstFailedRule = failedRules.length > 0 ? failedRules[0] : null;

  const validateEmail = (email: string) => {
    const re = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return re.test(email);
  };

  async function handleSignup(e: React.FormEvent) {
    e.preventDefault();

    setNameError(null);
    setEmailError(null);
    setPasswordError(null);

    let hasError = false;

    // Validate name
    if (!name.trim()) {
      setNameError("Name is required.");
      hasError = true;
    }

    // Validate email
    if (!email.trim()) {
      setEmailError("Email is required.");
      hasError = true;
    } else if (!validateEmail(email)) {
      setEmailError("Enter a valid email address.");
      hasError = true;
    }

    // Validate password
    if (!password || failedRules.length > 0) {
      setPasswordError(
        firstFailedRule ? firstFailedRule.message : "Password is required."
      );
      hasError = true;
    }

    if (hasError) {
      return;
    }

    setLoading(true);

    try {
      const { signup } = await import("../services/auth");
      await signup({ name: name.trim(), email: email.trim(), password });
      navigate("/");
    } catch (err: any) {
      alert(err?.message ?? "Signup failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <Card className="w-full max-w-sm py-8 px-4">
        <CardHeader>
          <CardTitle>Create your account</CardTitle>
          <CardDescription>
            Please fill in the details to get started.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSignup}>
            <div className="flex flex-col gap-4">
              {/* Name Field */}
              <div className="grid gap-2">
                <Label
                  htmlFor="name"
                  className={cn(!!nameError && "text-red-600")}
                >
                  Name
                </Label>
                <Input
                  id="name"
                  type="text"
                  value={name}
                  aria-invalid={!!nameError}
                  onChange={(e) => {
                    setName(e.target.value);
                    if (nameError) setNameError(null);
                  }}
                  icon={
                    <svg
                      className="w-4 h-4 text-muted-foreground"
                      viewBox="0 0 24 24"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
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
                {nameError && (
                  <p className="text-sm text-red-600 pl-1">{nameError}</p>
                )}
              </div>

              {/* Email Field */}
              <div className="grid gap-2">
                <Label
                  htmlFor="email"
                  className={cn(!!emailError && "text-red-600")}
                >
                  Email
                </Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    if (emailError) setEmailError(null);
                  }}
                  aria-invalid={!!emailError}
                  icon={
                    <svg
                      className="w-4 h-4 text-muted-foreground"
                      viewBox="0 0 24 24"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
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
                      />
                    </svg>
                  }
                />
                {emailError && (
                  <p className="text-sm text-red-600 pl-1">{emailError}</p>
                )}
              </div>

              {/* Password Field */}
              <div className="grid gap-2">
                <Label
                  htmlFor="password"
                  className={cn(!!passwordError && "text-red-600")}
                >
                  Password
                </Label>
                <Input
                  id="password"
                  variant="password"
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    if (passwordError) setPasswordError(null);
                  }}
                  aria-invalid={!!passwordError}
                  icon={
                    <svg
                      className="w-4 h-4 text-muted-foreground"
                      viewBox="0 0 24 24"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <rect
                        x="3"
                        y="10"
                        width="18"
                        height="10"
                        rx="2"
                        stroke="currentColor"
                        strokeWidth="1.5"
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
                {/* Feedback password rules*/}
                {passwordError && (
                  <div className="pl-1 text-red-600 dark:text-white flex items-center gap-2">
                    <CircleX className="w-3.5 h-3.5" />
                    <span className="text-sm">{passwordError}</span>
                  </div>
                )}
                {!passwordError && firstFailedRule && (
                  <div
                    key={firstFailedRule.key}
                    className="pl-1 text-gray-500 dark:text-white flex items-center gap-2"
                  >
                    <CircleX className="w-3.5 h-3.5" />
                    <span className="text-sm">{firstFailedRule.message}</span>
                  </div>
                )}
                {password && failedRules.length === 0 && (
                  <div className="pl-1 text-green-600 flex items-center gap-2">
                    <CircleCheck className="w-3.5 h-3.5" />
                    <span className="text-sm">All requirements met.</span>
                  </div>
                )}
              </div>
            </div>
          </form>
        </CardContent>
        <CardFooter className="flex-col gap-4">
          <Button
            type="submit"
            className="w-full"
            disabled={loading}
            onClick={handleSignup}
          >
            {loading ? <Spinner /> : "Create account"}
          </Button>

          <div className="w-full flex items-center text-sm text-muted-foreground before:flex-1 before:border-t before:border-gray-200 before:me-6 after:flex-1 after:border-t after:border-gray-200 after:ms-6 dark:text-neutral-500 dark:before:border-neutral-600 dark:after:border-neutral-600">
            Or continue with
          </div>

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
              className="underline hover:cursor-pointer text-black dark:text-white"
            >
              Sign in
            </button>
          </p>
        </CardFooter>
      </Card>

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
    </>
  );
}

export default Signup;
