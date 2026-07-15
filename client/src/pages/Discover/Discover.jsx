import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import {
    FaHeart,
    FaTimes,
    FaComments,
    FaEye,
    FaMapMarkerAlt,
    FaBriefcase,
    FaGraduationCap,
    FaBullseye
} from "react-icons/fa";

import { getUsers } from "../../services/userService";
import { likeUser } from "../../services/likeService";
import { getImageUrl } from "../../utils/imageUrl";

function Discover() {

    const navigate = useNavigate();

    const [users, setUsers] = useState([]);

    const [loading, setLoading] = useState(true);

    const [likedUsers, setLikedUsers] = useState([]);

    const [selectedUser, setSelectedUser] = useState(null);

    
    useEffect(() => {

        loadUsers();

    }, []);

    const loadUsers = async () => {

        try {

            const data = await getUsers();

            setUsers(data.users);

        }

        catch (error) {

            console.log(error);

        }

        finally {

            setLoading(false);

        }

    };

    const handleLike = async (receiverId) => {

        try {

            const response = await likeUser(receiverId);

            alert(response.message);

            setLikedUsers((previous) => [

                ...previous,

                receiverId

            ]);

            loadUsers();

        }

        catch (error) {

            alert(

                error.response?.data?.message ||

                "Unable to like user."

            );

        }

    };

    const handlePass = (userId) => {

        setUsers(

            users.filter(

                user => user._id !== userId

            )

        );

    };

    const openProfile = (user) => {

        setSelectedUser(user);

    };

    const closeProfile = () => {

        setSelectedUser(null);

    };

    if (loading) {

        return (

            <div className="flex justify-center items-center h-[70vh]">

                <h2 className="text-3xl font-bold">

                    Loading Discover...

                </h2>

            </div>

        );

    }

    return (

        <div className="max-w-7xl mx-auto px-4 md:px-6">

            <div className="mb-10">

                <h1 className="text-4xl font-bold">

                    ❤️ Discover People

                </h1>

                <p className="text-gray-500 mt-2">

                    Find someone who shares your interests.

                </p>

            </div>

            {

                users.length === 0

                ?

                (

                    <div className="bg-white rounded-3xl shadow-lg p-16 text-center">

                        <h2 className="text-3xl font-bold">

                            No more people nearby.

                        </h2>

                        <p className="text-gray-500 mt-3">

                            Check back later.

                        </p>

                    </div>

                )

                :

                (                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">

                        {

                            users.map((user) => (

                                <div
                                    key={user._id}
                                    className="bg-white rounded-3xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2"
                                >

                                    {/* ===============================
                                        Profile Photo
                                    =============================== */}

                                    <div className="relative">

                                        <img
    src={getImageUrl(user.profilePhoto)}
    alt={user.firstName}
    className="w-full h-96 object-cover"
/>
                                        <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 to-transparent p-6">

                                            <h2 className="text-white text-3xl font-bold">

                                                {user.firstName} {user.lastName}

                                            </h2>

                                            <p className="text-white">

                                                {user.age || "Age not provided"} years

                                            </p>

                                        </div>

                                    </div>

                                    {/* ===============================
                                        User Details
                                    =============================== */}

                                    <div className="p-6 space-y-4">

                                        <div className="flex items-center gap-3">

                                            <FaMapMarkerAlt className="text-pink-600" />

                                            <span>

                                                {user.location || "Location not provided"}

                                            </span>

                                        </div>

                                        <div className="flex items-center gap-3">

                                            <FaBriefcase className="text-pink-600" />

                                            <span>

                                                {user.occupation || "Occupation not provided"}

                                            </span>

                                        </div>

                                        <div className="flex items-center gap-3">

                                            <FaGraduationCap className="text-pink-600" />

                                            <span>

                                                {user.education || "Education not provided"}

                                            </span>

                                        </div>

                                        <div className="flex items-center gap-3">

                                            <FaBullseye className="text-pink-600" />

                                            <span>

                                                {user.relationshipGoal || "Not specified"}

                                            </span>

                                        </div>

                                        <div className="border-t pt-4">

                                            <p className="text-gray-600 leading-7">

                                                {

                                                    user.bio ||

                                                    "This user hasn't added a bio yet."

                                                }

                                            </p>

                                        </div>

                                        {/* ===============================
                                            Action Buttons
                                        =============================== */}

                                        <div className="grid grid-cols-2 gap-3 pt-3">

                                            {

                                                user.isMatched

                                                ?

                                                (

                                                    <div className="bg-pink-100 text-pink-700 rounded-xl py-3 text-center font-bold">

                                                        💕 Matched

                                                    </div>

                                                )

                                                :

                                                (

                                                    <button

                                                        onClick={() => handleLike(user._id)}

                                                        disabled={
                                                            user.isLiked ||
                                                            likedUsers.includes(user._id)
                                                        }

                                                        className={`rounded-xl py-3 font-semibold transition flex items-center justify-center gap-2

                                                        ${

                                                            user.isLiked ||

                                                            likedUsers.includes(user._id)

                                                            ?

                                                            "bg-pink-100 text-pink-600 cursor-not-allowed"

                                                            :

                                                            "bg-pink-600 hover:bg-pink-700 text-white"

                                                        }`}

                                                    >

                                                        <FaHeart />

                                                        {

                                                            user.isLiked ||

                                                            likedUsers.includes(user._id)

                                                            ?

                                                            "Liked"

                                                            :

                                                            "Like"

                                                        }

                                                    </button>

                                                )

                                            }

                                            <button

                                                onClick={() => openProfile(user)}

                                                className="rounded-xl py-3 bg-slate-200 hover:bg-slate-300 transition flex items-center justify-center gap-2"

                                            >

                                                <FaEye />

                                                View Profile

                                            </button>

                                        </div>

                                        {

                                            user.isMatched && (

                                                <button

                                                    onClick={() => navigate(`/messages/${user._id}`)}

                                                    className="w-full mt-3 rounded-xl py-3 bg-blue-600 hover:bg-blue-700 text-white transition flex items-center justify-center gap-2"

                                                >

                                                    <FaComments />

                                                    Message

                                                </button>

                                            )

                                        }

                                        <button

                                            onClick={() => handlePass(user._id)}

                                            className="w-full mt-3 rounded-xl py-3 border border-gray-300 hover:bg-gray-100 transition flex items-center justify-center gap-2"

                                        >

                                            <FaTimes />

                                            Pass

                                        </button>

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

                            onClick={closeProfile}

                            className="absolute top-5 right-5 bg-white rounded-full p-3 shadow-lg hover:bg-gray-100 transition z-20"

                        >

                            <FaTimes />

                        </button>

                        {/* Profile Image */}

                        <img
    src={getImageUrl(selectedUser.profilePhoto)}
    alt={selectedUser.firstName}
    className="w-full h-[450px] object-cover"
/>

                        {/* Profile Details */}

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

                                        <FaMapMarkerAlt className="text-pink-600" />

                                        Location

                                    </h3>

                                    <p className="mt-2">

                                        {selectedUser.location || "Not provided"}

                                    </p>

                                </div>

                                <div>

                                    <h3 className="font-bold flex items-center gap-2">

                                        <FaBriefcase className="text-pink-600" />

                                        Occupation

                                    </h3>

                                    <p className="mt-2">

                                        {selectedUser.occupation || "Not provided"}

                                    </p>

                                </div>

                                <div>

                                    <h3 className="font-bold flex items-center gap-2">

                                        <FaGraduationCap className="text-pink-600" />

                                        Education

                                    </h3>

                                    <p className="mt-2">

                                        {selectedUser.education || "Not provided"}

                                    </p>

                                </div>

                                <div>

                                    <h3 className="font-bold flex items-center gap-2">

                                        <FaBullseye className="text-pink-600" />

                                        Relationship Goal

                                    </h3>

                                    <p className="mt-2">

                                        {selectedUser.relationshipGoal || "Not specified"}

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

                                        "This user hasn't written a bio yet."

                                    }

                                </p>

                            </div>

                            <div className="grid grid-cols-2 gap-4 mt-10">

                                {

                                    selectedUser.isMatched

                                    ?

                                    (

                                        <button

                                            onClick={() => {

                                                closeProfile();

                                                navigate(`/messages/${selectedUser._id}`);

                                            }}

                                            className="rounded-xl py-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold transition flex justify-center items-center gap-2"

                                        >

                                            <FaComments />

                                            Message

                                        </button>

                                    )

                                    :

                                    (

                                        <button

                                            onClick={() => {

                                                handleLike(selectedUser._id);

                                                closeProfile();

                                            }}

                                            disabled={
                                                selectedUser.isLiked ||
                                                likedUsers.includes(selectedUser._id)
                                            }

                                            className={`rounded-xl py-4 font-semibold transition flex justify-center items-center gap-2

                                            ${

                                                selectedUser.isLiked ||

                                                likedUsers.includes(selectedUser._id)

                                                ?

                                                "bg-pink-100 text-pink-600 cursor-not-allowed"

                                                :

                                                "bg-pink-600 hover:bg-pink-700 text-white"

                                            }`}

                                        >

                                            <FaHeart />

                                            {

                                                selectedUser.isLiked ||

                                                likedUsers.includes(selectedUser._id)

                                                ?

                                                "Liked"

                                                :

                                                "Like"

                                            }

                                        </button>

                                    )

                                }

                                <button

                                    onClick={closeProfile}

                                    className="rounded-xl py-4 bg-gray-200 hover:bg-gray-300 transition"

                                >

                                    Close

                                </button>

                            </div>

                        </div>

                    </div>

                </div>

            )

            }

        </div>

    );

}

export default Discover;
