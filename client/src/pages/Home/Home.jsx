import { Link } from "react-router-dom";
import Navbar from "../../components/Navbar/Navbar";

function Home() {
    return (
        <>
            <Navbar />

            <section className="hero">

                <h1>Find Your Perfect Match</h1>

                <p>
                    Meet professionals who share your values,
                    interests and relationship goals.
                </p>

                <div className="buttons">

    <Link to="/register">
        <button>Get Started</button>
    </Link>

    <Link to="/login">
        <button>Login</button>
    </Link>

</div>

            </section>

            <section className="features">

                <div className="card">
                    <h2>❤️ Smart Matching</h2>
                    <p>Discover compatible people near you.</p>
                </div>

                <div className="card">
                    <h2>🔒 Secure Messaging</h2>
                    <p>Private conversations with your matches.</p>
                </div>

                <div className="card">
                    <h2>✔ Verified Profiles</h2>
                    <p>Meet real professionals with confidence.</p>
                </div>

            </section>

            <footer>
                © 2026 EliteConnect. All Rights Reserved.
            </footer>
        </>
    );
}

export default Home;