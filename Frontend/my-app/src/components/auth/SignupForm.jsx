import * as React from "react";
import { InputField } from "./InputField";

const formFields = [
  { id: "username", label: "Username", type: "text" },
  {
    id: "email",
    label: "Email",
    type: "email",
  },
  { id: "password", label: "Password", type: "password" },
];

export default function SignupForm() {
  const [formData, setFormData] = React.useState({});
  const [agreed, setAgreed] = React.useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
  };

  return (
    <main className="flex overflow-hidden flex-col justify-center items-center px-20 py-36 text-base bg-neutral-50 text-stone-400 max-md:px-5 max-md:py-24">
      <form
        onSubmit={handleSubmit}
        className="flex flex-col px-10 pt-16 pb-9 max-w-full bg-white rounded-3xl border border-solid border-zinc-300 w-[538px] max-md:px-5"
      >
        <h1 className="self-start text-4xl font-semibold text-black">Signup</h1>
        <p className="self-start text-2xl text-black">Let's Get Started</p>

        {formFields.map((field) => (
          <InputField
            key={field.id}
            id={field.id}
            label={field.label}
            type={field.type}
            value={field.value || formData[field.id] || ""}
            onChange={(e) =>
              setFormData({ ...formData, [field.id]: e.target.value })
            }
          />
        ))}

        <div className="flex gap-4 self-start mt-7 text-zinc-800">
          <input
            type="checkbox"
            id="terms"
            checked={agreed}
            onChange={(e) => setAgreed(e.target.checked)}
            className="shrink-0 rounded-md border border-solid border-zinc-300 h-[22px] w-[22px]"
          />
          <label htmlFor="terms" className="basis-auto">
            Agree to Our terms and Conditions
          </label>
        </div>

        <button
          type="submit"
          className="px-14 py-6 mt-7 text-white whitespace-nowrap bg-blue-700 rounded-xl border border-gray-200 border-solid shadow-[0px_10px_40px_rgba(174,174,174,0.2)] max-md:px-5 max-md:max-w-full"
        >
          Continue
        </button>

        <p className="self-center mt-6 ml-6 text-zinc-800">
          Already registered?{" "}
          <a href="/login" className="font-semibold">
            Login
          </a>
        </p>
      </form>
    </main>
  );
}
