import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
    FaHeart,
    FaEnvelope,
    FaLock,
    FaEye,
    FaEyeSlash
} from "react-icons/fa";

import { loginUser } from "../../services/authService";

function Login() {
    const navigate = useNavigate();

    const [form, setForm] = useState({
        email: "",
        password: ""
    });

    const [message, setMessage] = useState("");
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    const handleChange = (e) => {
        setForm({
            ...form,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        setLoading(true);
        setMessage("");

        try {
            const data = await loginUser(form);

            localStorage.setItem("token", data.token);

            localStorage.setItem(
                "user",
                JSON.stringify(data.user)
            );

            setMessage("Login successful!");

            setTimeout(() => {
                navigate("/dashboard");
            }, 800);

        } catch (error) {

            setMessage(
                error.response?.data?.message ||
                "Login failed."
            );

        } finally {

            setLoading(false);

        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-pink-100 via-white to-pink-200">

            <div className="max-w-7xl mx-auto min-h-screen grid lg:grid-cols-2">

                {/* LEFT SIDE */}

                <div className="hidden lg:flex flex-col justify-center px-16">

                    <h1 className="text-6xl font-extrabold text-gray-900">
                        ❤️ EliteConnect
                    </h1>

                    <h2 className="text-4xl font-bold mt-8">
                        Welcome Back
                    </h2>

                    <p className="text-gray-600 mt-6 text-lg leading-8">
                        Sign in to continue discovering amazing people,
                        chatting with your matches and building meaningful
                        relationships.
                    </p>

                    <div className="mt-10 space-y-5">

                        <div className="bg-white p-5 rounded-xl shadow hover:shadow-lg transition">
                            ❤️ Smart Match Recommendations
                        </div>

                        <div className="bg-white p-5 rounded-xl shadow hover:shadow-lg transition">
                            💬 Continue Your Conversations
                        </div>

                        <div className="bg-white p-5 rounded-xl shadow hover:shadow-lg transition">
                            🛡️ Secure & Private Account
                        </div>

                    </div>

                </div>

                {/* RIGHT SIDE */}

                <div className="flex justify-center items-center p-8">

                    <div className="bg-white w-full max-w-md rounded-3xl shadow-2xl p-10 hover:shadow-3xl transition duration-300">

                        <div className="text-center">

                            <FaHeart className="mx-auto text-pink-600 text-5xl animate-pulse" />

                            <h2 className="text-3xl font-bold mt-4">
                                Sign In
                            </h2>

                            <p className="text-gray-500 mt-2">
                                Welcome back to EliteConnect.
                            </p>

                        </div>

                        {message && (
                            <div
                                className={`mt-6 p-3 rounded-xl text-center font-semibold ${
                                    message.toLowerCase().includes("successful")
                                        ? "bg-green-100 text-green-700 border border-green-300"
                                        : "bg-red-100 text-red-700 border border-red-300"
                                }`}
                            >
                                {message}
                            </div>
                        )}

                        <form
                            onSubmit={handleSubmit}
                            className="mt-8 space-y-5"
                        >

                            {/* EMAIL */}

                            <div className="relative">

                                <FaEnvelope className="absolute left-4 top-4 text-gray-400" />

                                <input
                                    type="email"
                                    name="email"
                                    placeholder="Email Address"
                                    value={form.email}
                                    onChange={handleChange}
                                    required
                                    className="w-full pl-12 pr-4 py-3 border rounded-xl focus:ring-2 focus:ring-pink-500 outline-none transition"
                                />

                            </div>

                            {/* PASSWORD */}

                            <div className="relative">

                                <FaLock className="absolute left-4 top-4 text-gray-400" />

                                <input
                                    type={showPassword ? "text" : "password"}
                                    name="password"
                                    placeholder="Password"
                                    value={form.password}
                                    onChange={handleChange}
                                    required
                                    className="w-full pl-12 pr-12 py-3 border rounded-xl focus:ring-2 focus:ring-pink-500 outline-none transition"
                                />

                                <button
                                    type="button"
                                    onClick={() =>
                                        setShowPassword(!showPassword)
                                    }
                                    className="absolute right-4 top-4 text-gray-500 hover:text-pink-600"
                                >
                                    {showPassword ? (
                                        <FaEyeSlash />
                                    ) : (
                                        <FaEye />
                                    )}
                                </button>

                            </div>

                            {/* LOGIN BUTTON */}

                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full bg-pink-600 hover:bg-pink-700 hover:scale-[1.02] hover:shadow-xl transition duration-300 text-white py-3 rounded-xl font-bold disabled:opacity-60 disabled:cursor-not-allowed"
                            >
                                {loading ? "Signing In..." : "Login"}
                            </button>

                        </form>

                        <p className="text-center mt-8 text-gray-600">

                            Don't have an account?

                            <Link
                                to="/register"
                                className="text-pink-600 font-semibold ml-2 hover:underline"
                            >
                                Create One
                            </Link>

                        </p>

                    </div>

                </div>

            </div>

        </div>
    );
}

export default Login;