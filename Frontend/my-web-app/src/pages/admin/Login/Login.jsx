import * as React from "react";
import { Input } from "../../../components/auth/Input";
import { Button } from "../../../components/auth/Button";

export function LoginForm() {
    const handleSubmit = (e) => {
        e.preventDefault();
    };

    return (
        <div className="flex overflow-hidden flex-col justify-center items-center px-20 py-52 text-base bg-neutral-50 text-zinc-800 max-md:px-5 max-md:py-24">
            <form
                onSubmit={handleSubmit}
                className="flex flex-col px-10 pt-16 pb-9 max-w-full bg-white rounded-3xl border border-solid border-zinc-300 w-[538px] max-md:px-5"
                aria-labelledby="login-heading"
            >
                <h1 id="login-heading" className="self-start text-4xl font-semibold text-black">
                    Login
                </h1>
                <h2 className="self-start mt-1 text-2xl text-black">
                    to get started
                </h2>

                <div className="mt-12 max-md:mt-10">
                    <label htmlFor="email" className="sr-only">Email</label>
                    <Input
                        type="email"
                        id="email"
                        value="itsnaeemanjum@gmail.com"
                        placeholder="Email"
                        className="w-full max-md:max-w-full"
                    />
                </div>

                <div className="mt-5">
                    <label htmlFor="password" className="sr-only">Password</label>
                    <Input
                        type="password"
                        id="password"
                        placeholder="Password"
                        className="w-full text-stone-400 max-md:max-w-full"
                    />
                </div>

                <a
                    href="#forgot-password"
                    className="self-start mt-8 ml-3 max-md:ml-2.5"
                    tabIndex="0"
                >
                    Forgot Password?
                </a>

                <Button className="mt-11 max-md:mt-10 max-md:max-w-full">
                    Continue
                </Button>

                <div className="self-center mt-11 max-md:mt-10">
                    New User? {" "}
                    <a href="#register" className="font-semibold" tabIndex="0">
                        Register
                    </a>
                </div>
            </form>
        </div>
    );
}