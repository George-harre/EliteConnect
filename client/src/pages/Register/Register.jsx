import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { registerUser } from "../../services/authService";

function Register() {
    const navigate = useNavigate();

    const [form, setForm] = useState({
        firstName: "",
        lastName: "",
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
            // Send registration request
            const data = await registerUser(form);

            // Show success message
            setMessage(data.message);

            // Clear the form
            setForm({
                firstName: "",
                lastName: "",
                email: "",
                password: ""
            });

            // Redirect to login page after 1.5 seconds
            setTimeout(() => {
                navigate("/login");
            }, 1500);

        } catch (error) {
            setMessage(
                error.response?.data?.message ||
                "Registration failed."
            );
        }
    };

    return (
        <div className="form-container">
            <h1>Create Account</h1>

            <form onSubmit={handleSubmit}>
                <input
                    type="text"
                    name="firstName"
                    placeholder="First Name"
                    value={form.firstName}
                    onChange={handleChange}
                    required
                />

                <input
                    type="text"
                    name="lastName"
                    placeholder="Last Name"
                    value={form.lastName}
                    onChange={handleChange}
                    required
                />

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
                    Register
                </button>
            </form>

            {message && <p>{message}</p>}
        </div>
    );
}

export default Register;