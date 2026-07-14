import { Routes, Route } from "react-router-dom";

import Home from "../pages/Home/Home";
import Register from "../pages/Register/Register";
import Login from "../pages/Login/Login";
import Dashboard from "../pages/Dashboard/Dashboard";
import Discover from "../pages/Discover/Discover";
import Matches from "../pages/Matches/Matches";
import EditProfile from "../pages/EditProfile/EditProfile";

import ProtectedRoute from "./ProtectedRoute";
import MainLayout from "../layouts/MainLayout";

function AppRoutes() {
    return (
        <Routes>

            {/* ===============================
                Public Routes
            =============================== */}

            <Route path="/" element={<Home />} />

            <Route
                path="/register"
                element={<Register />}
            />

            <Route
                path="/login"
                element={<Login />}
            />

            {/* ===============================
                Protected Routes
            =============================== */}

            <Route
                element={
                    <ProtectedRoute>
                        <MainLayout />
                    </ProtectedRoute>
                }
            >

                <Route
                    path="/dashboard"
                    element={<Dashboard />}
                />

                <Route
                    path="/discover"
                    element={<Discover />}
                />

                <Route
                    path="/matches"
                    element={<Matches />}
                />

                <Route
                    path="/edit-profile"
                    element={<EditProfile />}
                />

            </Route>

        </Routes>
    );
}

export default AppRoutes;