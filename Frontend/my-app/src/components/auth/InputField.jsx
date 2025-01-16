import * as React from "react";

export function InputField({ id, label, type, value, onChange }) {
  return (
    <div className="mt-5 first:mt-8">
      <label htmlFor={id} className="sr-only">
        {label}
      </label>
      <input
        id={id}
        type={type}
        value={value}
        onChange={onChange}
        placeholder={label}
        aria-label={label}
        className="w-full px-7 py-6 whitespace-nowrap bg-white rounded-xl border border-gray-200 border-solid max-md:px-5 max-md:max-w-full"
      />
    </div>
  );
}
