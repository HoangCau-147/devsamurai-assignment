import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Moon, Sun } from "lucide-react";

import {
  applyTheme,
  getStoredTheme,
  setStoredTheme,
  type Theme,
} from "@/lib/theme";
import Login from "@/components/login";
import Signup from "@/components/signup";
import { Button } from "@/components/ui/button";
import usePageTitle from "@/hooks/use-page-title";
import { isAuthenticated } from "../lib/auth";

export default function AuthPage() {
  const navigate = useNavigate();
  const [currentTab, setCurrentTab] = useState<"login" | "signup">("login");
  const [theme, setTheme] = useState<Theme>(() => {
    const stored = getStoredTheme();
    return stored ?? "system";
  });

  usePageTitle(currentTab);

  useEffect(() => {
    if (isAuthenticated()) {
      navigate("/");
    }
  }, [navigate]);

  useEffect(() => {
    setStoredTheme(theme);
    applyTheme(theme);
  }, [theme]);

  return (
    <div className="w-screen h-screen flex flex-col items-center py-12 relative">
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

      {currentTab === "signup" && <Signup setCurrentTab={setCurrentTab} />}

      {currentTab === "login" && <Login setCurrentTab={setCurrentTab} />}

      <div className="absolute bottom-3 right-4">
        <Button
          variant="outline"
          size="icon"
          onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
          className="rounded-full"
        >
          <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
          <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
        </Button>
      </div>
    </div>
  );
}
