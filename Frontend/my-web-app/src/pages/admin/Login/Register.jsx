import * as React from "react";
import { Input } from "../../../components/auth/Input";
import { Button } from "../../../components/auth/Button";

const formFields = [
    { id: "username", label: "Username", type: "text" },
    { id: "email", label: "Email", type: "email", placeholder : "itsnaeemanjum@gmail.com" },
    { id: "password", label: "Password", type: "password" },
    { id: "confirmPassword", label: "Confirm Password", type: "password" }
];

export function SignupForm() {
    const handleSubmit = (e) => {
        e.preventDefault();
    };

    return (
        <main className="flex overflow-hidden flex-col justify-center items-center px-20 py-36 text-base bg-neutral-50 text-stone-400 max-md:px-5 max-md:py-24">
            <form
                onSubmit={handleSubmit}
                className="flex flex-col px-10 pt-16 pb-9 max-w-full bg-white rounded-3xl border border-solid border-zinc-300 w-[538px] max-md:px-5"
                aria-labelledby="signup-heading"
            >
                <h1 id="signup-heading" className="self-start text-4xl font-semibold text-black">
                    Signup
                </h1>
                <h2 className="self-start text-2xl text-black">to get started</h2>

                {formFields.map((field) => (
                    <Input
                        key={field.id}
                        id={field.id}
                        label={field.label}
                        type={field.type}
                        placeholder={field.value}
                    />
                ))}

                <div className="flex gap-4 self-start mt-7 text-zinc-800">
                    <input
                        type="checkbox"
                        id="terms"
                        className="shrink-0 rounded-md border border-solid border-zinc-300 h-[22px] w-[22px]"
                        aria-label="Accept terms and conditions"
                    />
                    <label htmlFor="terms" className="basis-auto">
                        Agree to Our terms and Conditions
                    </label>
                </div>

                <Button type="submit" label="Continue" />

                <div className="self-center mt-6 ml-6 text-zinc-800">
                    Already registered?{" "}
                    <a href="/login" className="font-semibold" tabIndex={0}>
                        Login
                    </a>
                </div>
            </form>
        </main>
    );
}