import { Routes, Route } from "react-router-dom";

import Home from "../pages/Home/Home";
import Register from "../pages/Register/Register";
import Login from "../pages/Login/Login";
import Dashboard from "../pages/Dashboard/Dashboard";

function AppRoutes() {
    return (
        <Routes>

            <Route path="/" element={<Home />} />

            <Route
                path="/register"
                element={<Register />}
            />

            <Route
                path="/login"
                element={<Login />}
            />

            <Route
                path="/dashboard"
                element={<Dashboard />}
            />

        </Routes>
    );
}

export default AppRoutes;