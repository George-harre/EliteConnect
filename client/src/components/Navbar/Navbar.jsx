import { Link, useNavigate } from "react-router-dom";
import {
    FaHeart,
    FaCompass,
    FaComments,
    FaUserFriends,
    FaSignOutAlt
} from "react-icons/fa";

import NotificationBell from "../NotificationBell";

function Navbar() {

    const navigate = useNavigate();

    const user = JSON.parse(
        localStorage.getItem("user")
    );

    const logout = () => {

        localStorage.removeItem("token");

        localStorage.removeItem("user");

        navigate("/login");

    };

    return (

        <nav className="bg-white shadow-md sticky top-0 z-50">

            <div className="max-w-7xl mx-auto px-6">

                <div className="flex justify-between items-center h-16">

                    {/* Logo */}

                    <Link
                        to="/dashboard"
                        className="flex items-center gap-2 text-2xl font-bold text-pink-600"
                    >

                        ❤️ EliteConnect

                    </Link>

                    {/* Navigation */}

                    <div className="flex items-center gap-8 font-medium">

                        <Link
                            to="/dashboard"
                            className="flex items-center gap-2 hover:text-pink-600 transition"
                        >

                            <FaUserFriends />

                            Dashboard

                        </Link>

                        <Link
                            to="/discover"
                            className="flex items-center gap-2 hover:text-pink-600 transition"
                        >

                            <FaCompass />

                            Discover

                        </Link>

                        <Link
                            to="/matches"
                            className="flex items-center gap-2 hover:text-pink-600 transition"
                        >

                            <FaHeart />

                            Matches

                        </Link>

                        <Link
                            to="/messages"
                            className="flex items-center gap-2 hover:text-pink-600 transition"
                        >

                            <FaComments />

                            Messages

                        </Link>

                    </div>

                    {/* Right Side */}

                    <div className="flex items-center gap-6">

                        {/* Live Notification Bell */}

                        <NotificationBell />

                        {/* Logged-in User */}

                        <span className="font-semibold text-gray-700">

                            {user?.firstName}

                        </span>

                        {/* Logout */}

                        <button
                            onClick={logout}
                            className="bg-pink-600 hover:bg-pink-700 transition text-white px-4 py-2 rounded-lg flex items-center gap-2"
                        >

                            <FaSignOutAlt />

                            Logout

                        </button>

                    </div>

                </div>

            </div>

        </nav>

    );

}

export default Navbar;