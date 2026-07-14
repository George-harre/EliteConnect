import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import {
    FaComments,
    FaMapMarkerAlt,
    FaBriefcase,
    FaHeart,
    FaEye
} from "react-icons/fa";

import {
    getMyMatches
} from "../../services/likeService";

function Matches() {

    const navigate = useNavigate();

    const [matches, setMatches] = useState([]);

    const [loading, setLoading] = useState(true);

    const [selectedUser, setSelectedUser] = useState(null);

    const API_URL =
        import.meta.env.VITE_API_URL.replace("/api", "");

    useEffect(() => {

        loadMatches();

    }, []);

    const loadMatches = async () => {

        try {

            const data = await getMyMatches();

            setMatches(data.matches);

        }

        catch (error) {

            console.log(error);

        }

        finally {

            setLoading(false);

        }

    };

    if (loading) {

        return (

            <div className="flex justify-center items-center h-[70vh]">

                <h2 className="text-3xl font-bold">

                    Loading your matches...

                </h2>

            </div>

        );

    }

    return (

        <div className="max-w-7xl mx-auto px-4 md:px-6">

            <div className="mb-10">

                <h1 className="text-4xl font-bold">

                    💕 Your Matches

                </h1>

                <p className="text-gray-500 mt-2">

                    Start meaningful conversations with your matches.

                </p>

            </div>

            {

                matches.length === 0

                ?

                (

                    <div className="bg-white rounded-3xl shadow-xl p-16 text-center">

                        <div className="text-7xl">

                            💔

                        </div>

                        <h2 className="text-3xl font-bold mt-6">

                            No matches yet

                        </h2>

                        <p className="text-gray-500 mt-4">

                            Discover people, like profiles and your future matches will appear here.

                        </p>

                        <button

                            onClick={() => navigate("/discover")}

                            className="mt-8 bg-pink-600 hover:bg-pink-700 text-white px-8 py-3 rounded-xl"

                        >

                            Discover People

                        </button>

                    </div>

                )

                :

                (

                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">

                        {

                            matches.map((match) => (

                                <div

                                    key={match.matchId}

                                    className="bg-white rounded-3xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2"

                                >

                                    <img

                                        src={

                                            match.user.profilePhoto

                                                ?

                                                `${API_URL}${match.user.profilePhoto}`

                                                :

                                                "https://placehold.co/600x700?text=No+Photo"

                                        }

                                        alt="Profile"

                                        className="w-full h-96 object-cover"

                                    />

                                    <div className="p-6">

                                        <h2 className="text-3xl font-bold">

                                            {match.user.firstName} {match.user.lastName}

                                        </h2>

                                        <div className="space-y-3 mt-5">

                                            <div className="flex items-center gap-3">

                                                <FaBriefcase className="text-pink-600"/>

                                                <span>

                                                    {match.user.occupation || "Occupation not provided"}

                                                </span>

                                            </div>

                                            <div className="flex items-center gap-3">

                                                <FaMapMarkerAlt className="text-pink-600"/>

                                                <span>

                                                    {match.user.location || "Location not provided"}

                                                </span>

                                            </div>

                                            <div className="flex items-center gap-3">

                                                <FaHeart className="text-pink-600"/>

                                                <span>

                                                    {match.user.relationshipGoal || "Relationship"}

                                                </span>

                                            </div>

                                        </div>

                                        <div className="grid grid-cols-2 gap-3 mt-8">

                                            <button

                                                onClick={() =>

                                                    navigate(`/messages/${match.user._id}`)

                                                }

                                                className="bg-pink-600 hover:bg-pink-700 text-white rounded-xl py-3 flex justify-center items-center gap-2"

                                            >

                                                <FaComments/>

                                                Message

                                            </button>

                                            <button

                                                onClick={() =>

                                                    setSelectedUser(match.user)

                                                }

                                                className="bg-slate-200 hover:bg-slate-300 rounded-xl py-3 flex justify-center items-center gap-2"

                                            >

                                                <FaEye/>

                                                View

                                            </button>

                                        </div>

                                    </div>

                                </div>

                            ))

                        }

                    </div>

                )

            }

            {

                selectedUser &&            (

                <div className="fixed inset-0 bg-black/70 flex items-center justify-center p-4 z-50">

                    <div className="bg-white rounded-3xl max-w-3xl w-full overflow-hidden relative max-h-[95vh] overflow-y-auto">

                        {/* Close Button */}

                        <button

                            onClick={() => setSelectedUser(null)}

                            className="absolute top-5 right-5 bg-white rounded-full p-3 shadow-lg hover:bg-gray-100 transition z-20"

                        >

                            ✕

                        </button>

                        {/* Profile Photo */}

                        <img

                            src={

                                selectedUser.profilePhoto

                                    ?

                                    `${API_URL}${selectedUser.profilePhoto}`

                                    :

                                    "https://placehold.co/900x700?text=No+Photo"

                            }

                            alt={selectedUser.firstName}

                            className="w-full h-[450px] object-cover"

                        />

                        {/* Details */}

                        <div className="p-8">

                            <h2 className="text-4xl font-bold">

                                {selectedUser.firstName} {selectedUser.lastName}

                            </h2>

                            <p className="text-gray-500 mt-2">

                                {selectedUser.age || "Age not provided"} years old

                            </p>

                            <div className="grid md:grid-cols-2 gap-6 mt-8">

                                <div>

                                    <h3 className="font-bold flex items-center gap-2">

                                        <FaMapMarkerAlt className="text-pink-600"/>

                                        Location

                                    </h3>

                                    <p className="mt-2">

                                        {selectedUser.location || "Not provided"}

                                    </p>

                                </div>

                                <div>

                                    <h3 className="font-bold flex items-center gap-2">

                                        <FaBriefcase className="text-pink-600"/>

                                        Occupation

                                    </h3>

                                    <p className="mt-2">

                                        {selectedUser.occupation || "Not provided"}

                                    </p>

                                </div>

                                <div>

                                    <h3 className="font-bold flex items-center gap-2">

                                        ❤️ Relationship Goal

                                    </h3>

                                    <p className="mt-2">

                                        {selectedUser.relationshipGoal || "Not specified"}

                                    </p>

                                </div>

                                <div>

                                    <h3 className="font-bold">

                                        Age

                                    </h3>

                                    <p className="mt-2">

                                        {selectedUser.age || "Not provided"}

                                    </p>

                                </div>

                            </div>

                            <div className="mt-8">

                                <h3 className="text-xl font-bold">

                                    About

                                </h3>

                                <p className="mt-3 text-gray-700 leading-8">

                                    {

                                        selectedUser.bio ||

                                        "This user hasn't added a bio yet."

                                    }

                                </p>

                            </div>

                            {

                                selectedUser.interests &&
                                selectedUser.interests.length > 0 &&

                                (

                                    <div className="mt-8">

                                        <h3 className="text-xl font-bold mb-4">

                                            Interests

                                        </h3>

                                        <div className="flex flex-wrap gap-3">

                                            {

                                                selectedUser.interests.map(

                                                    (interest, index) => (

                                                        <span

                                                            key={index}

                                                            className="bg-pink-100 text-pink-700 px-4 py-2 rounded-full"

                                                        >

                                                            {interest}

                                                        </span>

                                                    )

                                                )

                                            }

                                        </div>

                                    </div>

                                )

                            }

                            <button

                                onClick={() => {

                                    setSelectedUser(null);

                                    navigate(`/messages/${selectedUser._id}`);

                                }}

                                className="w-full mt-10 bg-pink-600 hover:bg-pink-700 text-white py-4 rounded-xl text-lg font-semibold flex justify-center items-center gap-3 transition"

                            >

                                <FaComments />

                                Start Conversation

                            </button>

                        </div>

                    </div>

                </div>

            )

            }

        </div>

    );

}

export default Matches;