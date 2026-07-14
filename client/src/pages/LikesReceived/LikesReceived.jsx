import { useEffect, useState } from "react";
import { FaHeart, FaTimes } from "react-icons/fa";

import {
    getLikesReceived,
    likeBack,
    ignoreLike
} from "../../services/likeService";

function LikesReceived() {

    const [likes, setLikes] = useState([]);
    const [loading, setLoading] = useState(true);

    // ===============================
    // Load Likes
    // ===============================
    const loadLikes = async () => {

        try {

            const data = await getLikesReceived();

            setLikes(data.likes);

        }

        catch (error) {

            console.log(error);

        }

        finally {

            setLoading(false);

        }

    };

    useEffect(() => {

        loadLikes();

    }, []);

    // ===============================
    // Like Back
    // ===============================
    const handleLikeBack = async (senderId) => {

        try {

            const response = await likeBack(senderId);

            alert(response.message);

            setLikes(prev =>
                prev.filter(
                    like =>
                        like.sender._id !== senderId
                )
            );

        }

        catch (error) {

            console.log(error);

        }

    };

    // ===============================
    // Ignore
    // ===============================
    const handleIgnore = async (senderId) => {

        try {

            await ignoreLike(senderId);

            setLikes(prev =>
                prev.filter(
                    like =>
                        like.sender._id !== senderId
                )
            );

        }

        catch (error) {

            console.log(error);

        }

    };

    if (loading) {

        return (

            <h2 className="text-center text-2xl mt-10">

                Loading likes...

            </h2>

        );

    }

    return (

        <div className="max-w-6xl mx-auto">

            <h1 className="text-4xl font-bold text-pink-600 mb-8">

                ❤️ Likes Received

            </h1>

            {

                likes.length === 0 ?

                (

                    <div className="bg-white rounded-3xl shadow-lg p-12 text-center">

                        <h2 className="text-2xl font-bold">

                            No new likes

                        </h2>

                        <p className="text-gray-500 mt-3">

                            When someone likes your profile,
                            they'll appear here.

                        </p>

                    </div>

                )

                :

                (

                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">

                        {

                            likes.map(like => (

                                <div
                                    key={like._id}
                                    className="bg-white rounded-3xl shadow-lg p-6 hover:shadow-2xl transition"
                                >

                                    <div className="flex flex-col items-center">

                                        {

                                            like.sender.profilePhoto ?

                                            (

                                                <img
                                                    src={`http://localhost:5000${like.sender.profilePhoto}`}
                                                    alt="Profile"
                                                    className="w-32 h-32 rounded-full object-cover border-4 border-pink-500"
                                                />

                                            )

                                            :

                                            (

                                                <div className="w-32 h-32 rounded-full bg-pink-500 text-white flex items-center justify-center text-5xl font-bold">

                                                    {

                                                        like.sender.firstName.charAt(0)

                                                    }

                                                </div>

                                            )

                                        }

                                        <h2 className="text-2xl font-bold mt-5">

                                            {like.sender.firstName}{" "}
                                            {like.sender.lastName}

                                        </h2>

                                        <p className="text-gray-500">

                                            {

                                                like.sender.occupation ||

                                                "Occupation not provided"

                                            }

                                        </p>

                                        <p className="text-gray-500">

                                            📍 {

                                                like.sender.location ||

                                                "Location not provided"

                                            }

                                        </p>

                                        <p className="mt-3 text-pink-600 font-semibold">

                                            ❤️ {

                                                like.sender.relationshipGoal ||

                                                "Looking for connection"

                                            }

                                        </p>

                                        <div className="flex gap-3 mt-6">

                                            <button
                                                onClick={() =>
                                                    handleLikeBack(
                                                        like.sender._id
                                                    )
                                                }
                                                className="bg-pink-600 hover:bg-pink-700 text-white px-5 py-3 rounded-xl flex items-center gap-2"
                                            >

                                                <FaHeart />

                                                Like Back

                                            </button>

                                            <button
                                                onClick={() =>
                                                    handleIgnore(
                                                        like.sender._id
                                                    )
                                                }
                                                className="bg-gray-200 hover:bg-gray-300 px-5 py-3 rounded-xl flex items-center gap-2"
                                            >

                                                <FaTimes />

                                                Ignore

                                            </button>

                                        </div>

                                    </div>

                                </div>

                            ))

                        }

                    </div>

                )

            }

        </div>

    );

}

export default LikesReceived;