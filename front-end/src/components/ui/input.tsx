import * as React from "react"

import { cn } from "@/lib/utils"

type InputProps = React.ComponentProps<"input"> & {
  icon?: React.ReactNode
  variant?: "text" | "password"
}

function Input({ className, type = "text", icon, variant, ...props }: InputProps) {
  const [show, setShow] = React.useState(false)
  const isPassword = variant === "password" || type === "password"
  const inputType = isPassword ? (show ? "text" : "password") : type
  const hasError = props["aria-invalid"] === true || props["aria-invalid"] === "true";
  
  return (
    <div className="relative w-full">
      {icon ? (
        <div className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 flex items-center">
          {icon}
        </div>
      ) : null}

      <input
        required
        type={inputType}
        data-slot="input"
        className={cn(
          "file:text-foreground placeholder:text-muted-foreground selection:bg-primary selection:text-primary-foreground dark:bg-input/30 border-input h-9 w-full min-w-0 rounded-md border bg-transparent px-3 py-1 text-base shadow-xs transition-[color,box-shadow] outline-none file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
          "focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]",
          "aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive",
          icon ? "pl-10" : "",
          isPassword ? "pr-10" : "",
          hasError && "border-destructive focus-visible:border-destructive focus-visible:ring-destructive/20",
          className
        )}
        aria-invalid={hasError}
        {...props}
      />

      {isPassword ? (
        <button
          type="button"
          aria-label={show ? "Hide password" : "Show password"}
          onClick={() => setShow((s) => !s)}
          className="absolute right-2 top-1/2 -translate-y-1/2 inline-flex items-center justify-center rounded-md px-2 py-1 text-sm text-muted-foreground hover:bg-accent/10"
        >
          {show ? (
            <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.875 18.825A10.05 10.05 0 0 1 12 19c-5 0-9-4-9-7s4-7 9-7c1.05 0 2.06.17 3 .49" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 3l18 18" />
            </svg>
          ) : (
            <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
              <circle cx="12" cy="12" r="3" strokeWidth="2" />
            </svg>
          )}
        </button>
      ) : null}
    </div>
  )
}

export { Input }
