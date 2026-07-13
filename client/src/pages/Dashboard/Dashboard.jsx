import { Link } from "react-router-dom";

function Dashboard() {

    const user = JSON.parse(localStorage.getItem("user"));

    return (
        <div style={{ padding: "40px" }}>

            <h1>Welcome, {user?.firstName} 👋</h1>

            <p>
                You have successfully logged into EliteConnect.
            </p>

            <br />

            <h3>Your Account</h3>

            <p><strong>Name:</strong> {user?.firstName} {user?.lastName}</p>

            <p><strong>Email:</strong> {user?.email}</p>

            <br />

            <Link to="/">
                <button>Back Home</button>
            </Link>

        </div>
    );
}

export default Dashboard;