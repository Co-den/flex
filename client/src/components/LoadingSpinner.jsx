import React from "react";

/**
 * Small accessible spinner (Tailwind)
 * Props: size (number px), ariaLabel (string)
 */
export default function LoadingSpinner({ size = 40, ariaLabel = "Loading" }) {
  const s = `${size}px`;
  return (
    <div role="status" aria-live="polite" aria-label={ariaLabel} className="flex items-center justify-center">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        style={{ width: s, height: s }}
        viewBox="0 0 50 50"
        className="animate-spin"
        fill="none"
      >
        <circle cx="25" cy="25" r="20" stroke="rgba(0,0,0,0.08)" strokeWidth="6" />
        <path
          d="M45 25a20 20 0 00-6-14"
          stroke="currentColor"
          strokeWidth="6"
          strokeLinecap="round"
        />
      </svg>
      <span className="sr-only">{ariaLabel}</span>
    </div>
  );
}
