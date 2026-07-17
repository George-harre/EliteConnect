import { Routes, Route } from "react-router-dom";

import Home from "../pages/Home/Home";
import Register from "../pages/Register/Register";
import Login from "../pages/Login/Login";
import VerifyEmail from "../pages/VerifyEmail/VerifyEmail";

import Dashboard from "../pages/Dashboard/Dashboard";
import Discover from "../pages/Discover/Discover";
import Matches from "../pages/Matches/Matches";
import Messages from "../pages/Messages/Messages";
import Chat from "../pages/Chat/Chat";
import Notifications from "../pages/Notifications/Notifications";
import EditProfile from "../pages/EditProfile/EditProfile";
import LikesReceived from "../pages/LikesReceived/LikesReceived";
import Profile from "../pages/Profile/Profile";

import ProtectedRoute from "./ProtectedRoute";
import MainLayout from "../layouts/MainLayout";

function AppRoutes() {

    return (

        <Routes>

            {/* ===============================
                Public Routes
            =============================== */}

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

            <Route
                path="/verify-email/:token"
                element={<VerifyEmail />}
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
                    path="/likes"
                    element={<LikesReceived />}
                />

                <Route
                    path="/matches"
                    element={<Matches />}
                />

                <Route
                    path="/messages"
                    element={<Messages />}
                />

                <Route
                    path="/messages/:userId"
                    element={<Chat />}
                />

                <Route
                    path="/notifications"
                    element={<Notifications />}
                />

                <Route
                    path="/edit-profile"
                    element={<EditProfile />}
                />
                <Route
    path="/profile/:userId"
    element={<Profile />}
/>

            </Route>

        </Routes>

    );

}

export default AppRoutes;