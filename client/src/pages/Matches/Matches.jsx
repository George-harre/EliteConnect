import { useEffect, useState } from "react";
import { FaHeart, FaComments } from "react-icons/fa";
import { getMyMatches } from "../../services/likeService";

function Matches() {

    const [matches, setMatches] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadMatches();
    }, []);

    const loadMatches = async () => {

        try {

            const data = await getMyMatches();

            setMatches(data.matches);

        } catch (error) {

            console.error(error);

        } finally {

            setLoading(false);

        }

    };

    if (loading) {

        return (
            <h2 className="text-center text-2xl mt-10">
                Loading matches...
            </h2>
        );

    }

    return (

        <div className="max-w-6xl mx-auto">

            <h1 className="text-4xl font-bold text-pink-600 mb-8">
                💕 Your Matches
            </h1>

            {matches.length === 0 ? (

                <div className="bg-white rounded-3xl shadow-lg p-12 text-center">

                    <h2 className="text-2xl font-bold">
                        No matches yet
                    </h2>

                    <p className="text-gray-500 mt-3">
                        Keep discovering people and liking profiles.
                    </p>

                </div>

            ) : (

                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">

                    {matches.map(match => (

                        <div
                            key={match.matchId}
                            className="bg-white rounded-3xl shadow-lg p-6 hover:shadow-2xl transition"
                        >

                            <div className="flex flex-col items-center">

                                {match.user.profilePhoto ? (

                                    <img
                                        src={`http://localhost:5000${match.user.profilePhoto}`}
                                        alt="Profile"
                                        className="w-32 h-32 rounded-full object-cover border-4 border-pink-500"
                                    />

                                ) : (

                                    <div className="w-32 h-32 rounded-full bg-pink-500 text-white flex items-center justify-center text-5xl font-bold">

                                        {match.user.firstName.charAt(0)}

                                    </div>

                                )}

                                <h2 className="text-2xl font-bold mt-5">

                                    {match.user.firstName} {match.user.lastName}

                                </h2>

                                <p className="text-gray-500">

                                    {match.user.occupation || "Occupation not provided"}

                                </p>

                                <p className="text-gray-500">

                                    📍 {match.user.location || "Location not provided"}

                                </p>

                                <p className="mt-3 text-pink-600 font-semibold">

                                    ❤️ {match.user.relationshipGoal}

                                </p>

                                <button
                                    className="mt-6 bg-pink-600 hover:bg-pink-700 text-white px-6 py-3 rounded-xl flex items-center gap-2"
                                >
                                    <FaComments />

                                    Message

                                </button>

                            </div>

                        </div>

                    ))}

                </div>

            )}

        </div>

    );

}

export default Matches;