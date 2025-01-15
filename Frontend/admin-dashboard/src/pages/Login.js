import React, { useState } from "react";
import API from "../services/api"; // pastikan Anda sudah mengatur Axios di services/api.js

function Login() {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");

    const handleLogin = async () => {
        try {
            const res = await API.post("/login", { username, password });
            localStorage.setItem("token", res.data.token);
            alert("Login success!");
            // Redirect atau logika lainnya setelah login sukses
        } catch (error) {
            alert("Login failed");
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100">
            <div className="p-6 bg-white rounded shadow-md w-full max-w-sm">
                <h2 className="text-2xl font-bold mb-4 text-center">Admin Login</h2>
                <input
                    type="text"
                    placeholder="Username"
                    className="w-full p-2 mb-4 border border-gray-300 rounded"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                />
                <input
                    type="password"
                    placeholder="Password"
                    className="w-full p-2 mb-4 border border-gray-300 rounded"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />
                <button
                    onClick={handleLogin}
                    className="w-full p-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                >
                    Login
                </button>
            </div>
        </div>
    );
}

export default Login;
