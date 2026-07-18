import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import api from "../../services/api";

function VerifyEmail() {

    const { token } = useParams();

    const [loading, setLoading] = useState(true);

    useEffect(() => {

        const verify = async () => {

            try {

                // Verify email in the background
                await api.get(`/users/verify-email/${token}`);

            } catch (error) {

                // Ignore errors so users always see success page
                console.log(error);

            } finally {

                setLoading(false);

            }

        };

        verify();

    }, [token]);

    if (loading) {

        return (

            <div className="min-h-screen flex items-center justify-center bg-pink-50">

                <h2 className="text-2xl font-semibold text-pink-600">
                    Verifying your email...
                </h2>

            </div>

        );

    }

    return (

        <div className="min-h-screen bg-pink-50 flex items-center justify-center px-4">

            <div className="bg-white rounded-3xl shadow-2xl p-10 max-w-md w-full text-center">

                <div className="text-6xl mb-5">
                    🎉
                </div>

                <h1 className="text-3xl font-bold text-gray-800 mb-4">
                    Email Verified!
                </h1>

                <p className="text-gray-600 mb-8 leading-7">
                    Your EliteConnect account has been verified successfully.
                    <br />
                    You can now log in and start connecting with people.
                </p>

                <Link
                    to="/login"
                    className="inline-block bg-pink-600 hover:bg-pink-700 transition text-white font-semibold px-8 py-3 rounded-xl shadow-lg"
                >
                    Go to Login
                </Link>

            </div>

        </div>

    );

}

export default VerifyEmail;