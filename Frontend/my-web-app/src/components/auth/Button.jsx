import * as React from "react";

export function Button({ children, onClick, className }) {
    return (
        <button
            onClick={onClick}
            className={`px-14 py-6 text-white whitespace-nowrap bg-blue-700 rounded-xl border border-gray-200 border-solid shadow-[0px_10px_40px_rgba(174,174,174,0.2)] ${className}`}
        >
            {children}
        </button>
    );
}