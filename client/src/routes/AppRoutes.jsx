import { Routes, Route } from "react-router-dom";

function Home() {
    return (
        <div
            style={{
                textAlign: "center",
                marginTop: "100px",
                fontFamily: "Arial"
            }}
        >
            <h1>❤️ EliteConnect</h1>

            <h2>Welcome to EliteConnect</h2>

            <p>Your professional dating platform.</p>
        </div>
    );
}

function AppRoutes() {
    return (
        <Routes>
            <Route path="/" element={<Home />} />
        </Routes>
    );
}

export default AppRoutes;