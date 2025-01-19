import * as React from "react";

export function Input({ type, id, value, placeholder, className }) {
    return (
        <input
            type={type}
            id={id}
            value={value}
            placeholder={placeholder}
            className={`px-7 py-6 mt-5 whitespace-nowrap bg-white rounded-xl border border-gray-200 border-solid ${className}`}
            aria-label={placeholder}
        />
    );
}