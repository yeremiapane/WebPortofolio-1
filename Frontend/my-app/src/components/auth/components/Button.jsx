import * as React from "react";

export function Button({ children, onClick, className, disabled }) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`px-14 py-6 text-white whitespace-nowrap bg-blue-700 rounded-xl border border-gray-200 border-solid shadow-[0px_10px_40px_rgba(174,174,174,0.2)] hover:bg-blue-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 active:bg-blue-900 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors duration-200 ${className}`}
      role="button"
      aria-disabled={disabled}
    >
      {children}
    </button>
  );
}
