import { Routes, Route } from "react-router-dom";

import Home from "../pages/Home/Home";
import Register from "../pages/Register/Register";
import Login from "../pages/Login/Login";
import Dashboard from "../pages/Dashboard/Dashboard";
import EditProfile from "../pages/EditProfile/EditProfile";
import ProtectedRoute from "./ProtectedRoute";

function AppRoutes() {
    return (
        <Routes>

            {/* Public Routes */}
            <Route
                path="/"
                element={<Home />}
            />

            <Route
                path="/register"
                element={<Register />}
            />

            <Route
                path="/login"
                element={<Login />}
            />

            {/* Protected Dashboard */}
            <Route
                path="/dashboard"
                element={
                    <ProtectedRoute>
                        <Dashboard />
                    </ProtectedRoute>
                }
            />

            {/* Protected Edit Profile */}
            <Route
                path="/edit-profile"
                element={
                    <ProtectedRoute>
                        <EditProfile />
                    </ProtectedRoute>
                }
            />

        </Routes>
    );
}

export default AppRoutes;