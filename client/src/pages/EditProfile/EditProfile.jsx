import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getProfile, updateProfile } from "../../services/userService";

function EditProfile() {

    const navigate = useNavigate();

    const [form, setForm] = useState({
        occupation: "",
        company: "",
        education: "",
        location: "",
        age: "",
        relationshipGoal: "",
        bio: ""
    });

    const [message, setMessage] = useState("");

    useEffect(() => {

        const loadProfile = async () => {

            try {

                const data = await getProfile();

                setForm({
                    occupation: data.user.occupation || "",
                    company: data.user.company || "",
                    education: data.user.education || "",
                    location: data.user.location || "",
                    age: data.user.age || "",
                    relationshipGoal: data.user.relationshipGoal || "",
                    bio: data.user.bio || ""
                });

            } catch (error) {

                navigate("/login");

            }

        };

        loadProfile();

    }, [navigate]);

    const handleChange = (e) => {

        setForm({
            ...form,
            [e.target.name]: e.target.value
        });

    };

    const handleSubmit = async (e) => {

        e.preventDefault();

        try {

            const response = await updateProfile(form);

            setMessage(response.message);

            setTimeout(() => {

                navigate("/dashboard");

            }, 1000);

        } catch (error) {

            setMessage(
                error.response?.data?.message ||
                "Update failed."
            );

        }

    };

    return (

        <div className="form-container">

            <h1>Edit Profile</h1>

            <form onSubmit={handleSubmit}>

                <input
                    name="occupation"
                    placeholder="Occupation"
                    value={form.occupation}
                    onChange={handleChange}
                />

                <input
                    name="company"
                    placeholder="Company"
                    value={form.company}
                    onChange={handleChange}
                />

                <input
                    name="education"
                    placeholder="Education"
                    value={form.education}
                    onChange={handleChange}
                />

                <input
                    name="location"
                    placeholder="Location"
                    value={form.location}
                    onChange={handleChange}
                />

                <input
                    type="number"
                    name="age"
                    placeholder="Age"
                    value={form.age}
                    onChange={handleChange}
                />

                <select
                    name="relationshipGoal"
                    value={form.relationshipGoal}
                    onChange={handleChange}
                >
                    <option value="">Select Relationship Goal</option>
                    <option value="Long-term relationship">Long-term relationship</option>
                    <option value="Short-term dating">Short-term dating</option>
                    <option value="Friendship">Friendship</option>
                    <option value="Marriage">Marriage</option>
                    <option value="Not sure">Not sure</option>
                </select>

                <textarea
                    name="bio"
                    placeholder="Tell us about yourself..."
                    value={form.bio}
                    onChange={handleChange}
                    rows="5"
                />

                <button type="submit">
                    Save Changes
                </button>

            </form>

            {message && <p>{message}</p>}

        </div>

    );

}

export default EditProfile;