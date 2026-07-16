import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import api from "../../services/api";

function VerifyEmail() {
    const { token } = useParams();

    const [loading, setLoading] = useState(true);
    const [success, setSuccess] = useState(false);
    const [message, setMessage] = useState("");

    useEffect(() => {
        const verify = async () => {
            try {
                const res = await api.get(`/users/verify-email/${token}`);

                setSuccess(true);
                setMessage(res.data.message);
            } catch (err) {
                setSuccess(false);
                setMessage(
                    err.response?.data?.message ||
                    "Verification failed."
                );
            } finally {
                setLoading(false);
            }
        };

        verify();
    }, [token]);

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <h2 className="text-xl font-semibold">
                    Verifying your email...
                </h2>
            </div>
        );
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-pink-50">
            <div className="bg-white rounded-xl shadow-lg p-8 max-w-md w-full text-center">

                <h1 className="text-3xl font-bold mb-4">
                    {success
                        ? "🎉 Email Verified!"
                        : "❌ Verification Failed"}
                </h1>

                <p className="mb-6 text-gray-700">
                    {message}
                </p>

                <Link
                    to="/login"
                    className="bg-pink-600 text-white px-6 py-3 rounded-lg hover:bg-pink-700"
                >
                    Go to Login
                </Link>

            </div>
        </div>
    );
}

export default VerifyEmail;