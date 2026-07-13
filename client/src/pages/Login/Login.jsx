import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { loginUser } from "../../services/authService";

function Login() {
    const navigate = useNavigate();

    const [form, setForm] = useState({
        email: "",
        password: ""
    });

    const [message, setMessage] = useState("");

    const handleChange = (e) => {
        setForm({
            ...form,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const data = await loginUser(form);

            // Save JWT Token
            localStorage.setItem("token", data.token);

            // Save logged-in user
            localStorage.setItem(
                "user",
                JSON.stringify(data.user)
            );

            setMessage("Login successful!");

            setTimeout(() => {
                navigate("/dashboard");
            }, 1000);

        } catch (error) {
            setMessage(
                error.response?.data?.message ||
                "Login failed."
            );
        }
    };

    return (
        <div className="form-container">

            <h1>Login</h1>

            <form onSubmit={handleSubmit}>

                <input
                    type="email"
                    name="email"
                    placeholder="Email"
                    value={form.email}
                    onChange={handleChange}
                    required
                />

                <input
                    type="password"
                    name="password"
                    placeholder="Password"
                    value={form.password}
                    onChange={handleChange}
                    required
                />

                <button type="submit">
                    Login
                </button>

            </form>

            {message && <p>{message}</p>}

        </div>
    );
}

export default Login;