import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { getProfile } from "../../services/userService";

function Dashboard() {
    const navigate = useNavigate();

    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadProfile = async () => {
            try {
                const data = await getProfile();
                setUser(data.user);
            } catch (error) {
                localStorage.removeItem("token");
                localStorage.removeItem("user");
                navigate("/login");
            } finally {
                setLoading(false);
            }
        };

        loadProfile();
    }, [navigate]);

    const handleLogout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        navigate("/login");
    };

    if (loading) {
        return (
            <h2 style={{ textAlign: "center", marginTop: "100px" }}>
                Loading...
            </h2>
        );
    }

    return (
        <div style={{ padding: "40px" }}>
            <h1>Welcome, {user.firstName} 👋</h1>

            <hr />
            <br />

            <h2>Profile Information</h2>

            <p>
                <strong>Name:</strong> {user.firstName} {user.lastName}
            </p>

            <p>
                <strong>Email:</strong> {user.email}
            </p>

            <p>
                <strong>Occupation:</strong>{" "}
                {user.occupation || "Not provided"}
            </p>

            <p>
                <strong>Company:</strong>{" "}
                {user.company || "Not provided"}
            </p>

            <p>
                <strong>Education:</strong>{" "}
                {user.education || "Not provided"}
            </p>

            <p>
                <strong>Location:</strong>{" "}
                {user.location || "Not provided"}
            </p>

            <p>
                <strong>Age:</strong>{" "}
                {user.age || "Not provided"}
            </p>

            <p>
                <strong>Relationship Goal:</strong>{" "}
                {user.relationshipGoal}
            </p>

            <p>
                <strong>Interested In:</strong>{" "}
                {user.interestedIn}
            </p>

            <p>
                <strong>Bio:</strong>{" "}
                {user.bio || "No bio yet."}
            </p>

            <br />

            <Link to="/edit-profile">
                <button>Edit Profile</button>
            </Link>

            <br />
            <br />

            <button onClick={handleLogout}>
                Logout
            </button>
        </div>
    );
}

export default Dashboard;