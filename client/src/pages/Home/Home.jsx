import { Link } from "react-router-dom";
import {
    FaHeart,
    FaComments,
    FaShieldAlt,
    FaArrowRight
} from "react-icons/fa";

function Home() {
    return (
        <div className="min-h-screen bg-gradient-to-br from-pink-50 via-white to-pink-100">

            {/* Hero Section */}
            <section className="max-w-7xl mx-auto px-6 py-24">

                <div className="grid md:grid-cols-2 gap-12 items-center">

                    {/* Left Side */}
                    <div>

                        <h1 className="text-6xl font-extrabold text-gray-900 leading-tight">
                            Find Your
                            <span className="text-pink-600"> Perfect Match ❤️</span>
                        </h1>

                        <p className="mt-6 text-xl text-gray-600 leading-relaxed">
                            EliteConnect helps you build meaningful friendships,
                            relationships and lifelong connections through
                            intelligent matching.
                        </p>

                        <div className="mt-10 flex gap-5">

                            <Link
                                to="/register"
                                className="bg-pink-600 hover:bg-pink-700 text-white px-8 py-4 rounded-xl font-semibold flex items-center gap-3 transition"
                            >
                                Get Started
                                <FaArrowRight />
                            </Link>

                            <Link
                                to="/login"
                                className="border-2 border-pink-600 text-pink-600 hover:bg-pink-600 hover:text-white px-8 py-4 rounded-xl font-semibold transition"
                            >
                                Login
                            </Link>

                        </div>

                    </div>

                    {/* Right Side */}
                    <div className="flex justify-center">

                        <div className="bg-white rounded-3xl shadow-2xl p-10 w-full max-w-md">

                            <div className="text-7xl text-center">
                                ❤️
                            </div>

                            <h2 className="text-3xl font-bold text-center mt-4">
                                EliteConnect
                            </h2>

                            <p className="text-center text-gray-500 mt-4">
                                Connecting hearts through technology.
                            </p>

                            <div className="mt-8 space-y-4">

                                <div className="bg-pink-100 rounded-xl p-4">
                                    ❤️ Smart Compatibility
                                </div>

                                <div className="bg-pink-100 rounded-xl p-4">
                                    💬 Secure Messaging
                                </div>

                                <div className="bg-pink-100 rounded-xl p-4">
                                    🛡️ Verified Profiles
                                </div>

                            </div>

                        </div>

                    </div>

                </div>

            </section>

            {/* Features */}
            <section className="bg-white py-20">

                <div className="max-w-7xl mx-auto px-6">

                    <h2 className="text-4xl font-bold text-center mb-16">
                        Why Choose EliteConnect?
                    </h2>

                    <div className="grid md:grid-cols-3 gap-8">

                        <div className="bg-pink-50 rounded-2xl p-8 shadow">

                            <FaHeart className="text-5xl text-pink-600 mb-6" />

                            <h3 className="text-2xl font-bold">
                                Smart Matching
                            </h3>

                            <p className="mt-4 text-gray-600">
                                Discover compatible people based on shared
                                interests, goals and lifestyle.
                            </p>

                        </div>

                        <div className="bg-pink-50 rounded-2xl p-8 shadow">

                            <FaComments className="text-5xl text-pink-600 mb-6" />

                            <h3 className="text-2xl font-bold">
                                Secure Messaging
                            </h3>

                            <p className="mt-4 text-gray-600">
                                Start conversations only after a mutual match.
                            </p>

                        </div>

                        <div className="bg-pink-50 rounded-2xl p-8 shadow">

                            <FaShieldAlt className="text-5xl text-pink-600 mb-6" />

                            <h3 className="text-2xl font-bold">
                                Safe Community
                            </h3>

                            <p className="mt-4 text-gray-600">
                                Enjoy a trusted environment with verified users
                                and secure authentication.
                            </p>

                        </div>

                    </div>

                </div>

            </section>

            {/* CTA */}
            <section className="py-20 bg-pink-600 text-white">

                <div className="max-w-5xl mx-auto text-center px-6">

                    <h2 className="text-5xl font-bold">
                        Ready to Meet Someone Amazing?
                    </h2>

                    <p className="mt-6 text-xl">
                        Join EliteConnect today and begin your journey toward
                        meaningful relationships.
                    </p>

                    <Link
                        to="/register"
                        className="inline-block mt-10 bg-white text-pink-600 px-10 py-4 rounded-xl font-bold hover:scale-105 transition"
                    >
                        Create Free Account
                    </Link>

                </div>

            </section>

            {/* Footer */}
            <footer className="bg-gray-900 text-gray-300 py-8">

                <div className="text-center">

                    <h3 className="text-2xl font-bold text-white">
                        ❤️ EliteConnect
                    </h3>

                    <p className="mt-3">
                        Connecting hearts through technology.
                    </p>

                    <p className="mt-5 text-sm text-gray-500">
                        © 2026 EliteConnect • Made with ❤️ 
                                           </p>

                </div>

            </footer>

        </div>
    );
}

export default Home;