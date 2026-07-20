import { useState } from "react";
import {
    Link,
    NavLink,
    useNavigate
} from "react-router-dom";

import {
    FaHeart,
    FaCompass,
    FaComments,
    FaUserFriends,
    FaSignOutAlt,
    FaBars,
    FaTimes
} from "react-icons/fa";

import NotificationBell from "../NotificationBell";

function Navbar() {

    const navigate = useNavigate();

    const [menuOpen, setMenuOpen] = useState(false);

    const user = JSON.parse(
        localStorage.getItem("user")
    );

    const logout = () => {

        localStorage.removeItem("token");
        localStorage.removeItem("user");

        navigate("/login");

    };

    const closeMenu = () => {

        setMenuOpen(false);

    };

    const navLinkClass = ({ isActive }) =>

        `flex items-center gap-2 px-3 py-2 rounded-lg transition duration-200 ${
            isActive
                ? "bg-pink-100 text-pink-600 font-bold"
                : "text-gray-700 hover:bg-pink-50 hover:text-pink-600"
        }`;

    return (

        <nav className="bg-white shadow-md sticky top-0 z-50">

            <div className="max-w-7xl mx-auto px-4 sm:px-6">

                <div className="flex justify-between items-center h-16">

                    {/* Logo */}

                    <Link
                        to="/dashboard"
                        className="text-2xl font-bold text-pink-600"
                    >
                        ❤️ EliteConnect
                    </Link>

                    {/* Desktop Navigation */}

                    <div className="hidden md:flex items-center gap-2">

                        <NavLink
                            to="/dashboard"
                            className={navLinkClass}
                        >
                            <FaUserFriends />
                            Dashboard
                        </NavLink>

                        <NavLink
                            to="/discover"
                            className={navLinkClass}
                        >
                            <FaCompass />
                            Discover
                        </NavLink>

                        <NavLink
                            to="/matches"
                            className={navLinkClass}
                        >
                            <FaHeart />
                            Matches
                        </NavLink>

                        <NavLink
                            to="/messages"
                            className={navLinkClass}
                        >
                            <FaComments />
                            Messages
                        </NavLink>

                    </div>

                    {/* Desktop Right Side */}

                    <div className="hidden md:flex items-center gap-4">

                        <NotificationBell />

                        <span className="font-semibold text-gray-700">

                            {user?.firstName}

                        </span>

                        <button
                            onClick={logout}
                            className="bg-pink-600 hover:bg-pink-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition"
                        >
                            <FaSignOutAlt />
                            Logout
                        </button>

                    </div>

                    {/* Mobile Buttons */}

                    <div className="md:hidden flex items-center gap-4">

                        <NotificationBell />

                        <button
    className="
        bg-pink-600
        hover:bg-pink-700

        text-white

        rounded-lg

        p-3

        transition
    "
>
    <FaBars className="text-xl text-white" />
</button>
                    </div>

                </div>

            </div>

            {/* Mobile Menu */}

            {

                menuOpen &&

                <div className="md:hidden bg-white border-t shadow-lg">

                    <div className="flex flex-col p-4 space-y-2">

                        <NavLink
                            to="/dashboard"
                            className={navLinkClass}
                            onClick={closeMenu}
                        >
                            <FaUserFriends />
                            Dashboard
                        </NavLink>

                        <NavLink
                            to="/discover"
                            className={navLinkClass}
                            onClick={closeMenu}
                        >
                            <FaCompass />
                            Discover
                        </NavLink>

                        <NavLink
                            to="/matches"
                            className={navLinkClass}
                            onClick={closeMenu}
                        >
                            <FaHeart />
                            Matches
                        </NavLink>

                        <NavLink
                            to="/messages"
                            className={navLinkClass}
                            onClick={closeMenu}
                        >
                            <FaComments />
                            Messages
                        </NavLink>

                        <div className="border-t pt-4 mt-2">

                            <p className="font-semibold mb-3">

                                {user?.firstName}

                            </p>

                            <button
                                onClick={logout}
                                className="w-full bg-pink-600 hover:bg-pink-700 text-white py-3 rounded-lg flex justify-center items-center gap-2"
                            >
                                <FaSignOutAlt />
                                Logout
                            </button>

                        </div>

                    </div>

                </div>

            }

        </nav>

    );

}

export default Navbar;