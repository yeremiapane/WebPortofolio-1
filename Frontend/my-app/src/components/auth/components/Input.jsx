import * as React from "react";

export function Input({ type, id, value, onChange, placeholder, className }) {
  return (
    <input
      type={type}
      id={id}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      className={`px-7 py-6 mt-5 whitespace-nowrap bg-white rounded-xl border border-gray-200 border-solid focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${className}`}
      aria-label={placeholder}
    />
  );
}
