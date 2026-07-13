import { useEffect, useState } from "react";
import { getUsers } from "../../services/userService";
import { likeUser } from "../../services/likeService";

function Discover() {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [likedUsers, setLikedUsers] = useState([]);

    useEffect(() => {
        const loadUsers = async () => {
            try {
                const data = await getUsers();
                setUsers(data.users);
            } catch (error) {
                console.log(error);
            } finally {
                setLoading(false);
            }
        };

        loadUsers();
    }, []);

    const handleLike = async (receiverId) => {
        try {
            const data = await likeUser(receiverId);

            alert(data.message);

            setLikedUsers((previous) => [
                ...previous,
                receiverId
            ]);
        } catch (error) {
            alert(
                error.response?.data?.message ||
                "Failed to like user."
            );
        }
    };

    if (loading) {
        return (
            <h2 style={{ textAlign: "center" }}>
                Loading...
            </h2>
        );
    }

    return (
        <div
            style={{
                maxWidth: "1200px",
                margin: "40px auto",
                padding: "20px"
            }}
        >
            <h1 style={{ textAlign: "center" }}>
                ❤️ Discover People
            </h1>

            {users.length === 0 ? (
                <h3 style={{ textAlign: "center" }}>
                    No users found.
                </h3>
            ) : (
                <div
                    style={{
                        display: "grid",
                        gridTemplateColumns:
                            "repeat(auto-fit, minmax(320px, 1fr))",
                        gap: "25px",
                        marginTop: "30px"
                    }}
                >
                    {users.map((user) => (
                        <div
                            key={user._id}
                            style={{
                                border: "1px solid #ddd",
                                borderRadius: "15px",
                                padding: "20px",
                                boxShadow:
                                    "0 5px 15px rgba(0,0,0,0.1)",
                                background: "#fff"
                            }}
                        >
                            <img
                                src={
                                    user.profilePhoto
                                        ? `http://localhost:5000${user.profilePhoto}`
                                        : "https://placehold.co/300x300?text=No+Photo"
                                }
                                alt="Profile"
                                style={{
                                    width: "100%",
                                    height: "300px",
                                    objectFit: "cover",
                                    borderRadius: "10px"
                                }}
                            />

                            <h2>
                                {user.firstName} {user.lastName}
                            </h2>

                            <p>
                                <strong>Age:</strong>{" "}
                                {user.age || "Not provided"}
                            </p>

                            <p>
                                <strong>Location:</strong>{" "}
                                {user.location || "Not provided"}
                            </p>

                            <p>
                                <strong>Occupation:</strong>{" "}
                                {user.occupation || "Not provided"}
                            </p>

                            <p>
                                <strong>Relationship Goal:</strong>{" "}
                                {user.relationshipGoal}
                            </p>

                            <p>
                                <strong>Bio:</strong>
                                <br />
                                {user.bio || "No bio yet."}
                            </p>

                            <div
                                style={{
                                    display: "flex",
                                    justifyContent: "space-between",
                                    marginTop: "20px"
                                }}
                            >
                                <button
                                    onClick={() =>
                                        handleLike(user._id)
                                    }
                                    disabled={likedUsers.includes(user._id)}
                                >
                                    {likedUsers.includes(user._id)
                                        ? "❤️ Liked"
                                        : "❤️ Like"}
                                </button>

                                <button>
                                    👎 Pass
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

export default Discover;