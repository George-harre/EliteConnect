import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import {
    FaHeart,
    FaComments,
    FaUserEdit,
    FaCompass,
    FaMapMarkerAlt,
    FaBriefcase,
    FaGraduationCap,
    FaEnvelope
} from "react-icons/fa";

import {
    getProfile,
    getDashboardStats
} from "../../services/userService";

import ProfilePhotoUploader from "../../components/ProfilePhotoUploader";
import ProfileCompletion from "../../components/ProfileCompletion";
import StatCard from "../../components/StatCard";
import QuickActionCard from "../../components/QuickActionCard";
import { getImageUrl } from "../../utils/imageUrl";

function Dashboard() {

    const navigate = useNavigate();

    const [user, setUser] = useState(null);

    const [stats, setStats] = useState({

        likesReceived: 0,
        matches: 0,
        messages: 0,
        profileViews: 0

    });

    const [loading, setLoading] = useState(true);
    if (!user && !loading) {
    return (
        <div className="flex justify-center items-center min-h-[60vh]">
            <div className="text-red-500 text-xl">
                Failed to load your profile.
            </div>
        </div>
    );
}

    const loadProfile = async () => {

        try {

            const [profileData, statsData] = await Promise.all([

                getProfile(),
                getDashboardStats()

            ]);

            setUser(profileData.user);

            setStats(statsData);

        }

        catch {

            localStorage.removeItem("token");
            localStorage.removeItem("user");

            navigate("/login");

        }

        finally {

            setLoading(false);

        }

    };

    useEffect(() => {

        loadProfile();

    }, []);

    if (loading) {

        return (

            <div className="flex justify-center items-center min-h-[60vh]">

                <div className="animate-pulse text-pink-600 text-2xl font-bold">

                    Loading Dashboard...

                </div>

            </div>

        );

    }

    return (

        <div className="space-y-8">

            {/* ==========================
                Welcome Banner
            ========================== */}

            <div className="rounded-3xl bg-gradient-to-r from-pink-600 via-rose-500 to-red-500 text-white shadow-xl overflow-hidden">

                <div className="p-6 sm:p-8 lg:p-10">

                    <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold">

                        Welcome back,

                    </h1>

                    <h2 className="text-4xl sm:text-5xl font-extrabold mt-2">

                        {user.firstName} 👋

                    </h2>

                    <p className="mt-5 text-lg opacity-90 max-w-2xl">

                        Discover people, build meaningful relationships,
                        receive likes, match instantly and chat with people
                        who like you back.

                    </p>

                </div>

            </div>

            {/* ==========================
                Profile Completion
            ========================== */}

            <ProfileCompletion user={user} />

            {/* ==========================
                Statistics
            ========================== */}

            <div className="grid grid-cols-2 xl:grid-cols-4 gap-4 sm:gap-6">

                <div
                    className="cursor-pointer hover:scale-105 duration-300"
                    onClick={() => navigate("/matches")}
                >

                    <StatCard

                        icon="💕"

                        title="Matches"

                        value={stats.matches}

                    />

                </div>

                <div
                    className="cursor-pointer hover:scale-105 duration-300"
                    onClick={() => navigate("/likes")}
                >

                    <StatCard

                        icon="👍"

                        title="Likes Received"

                        value={stats.likesReceived}

                    />

                </div>

                <div
                    className="cursor-pointer hover:scale-105 duration-300"
                    onClick={() => navigate("/messages")}
                >

                    <StatCard

                        icon="💬"

                        title="Messages"

                        value={stats.messages}

                    />

                </div>

                <div
                    className="hover:scale-105 duration-300"
                >

                    <StatCard

                        icon="👀"

                        title="Profile Views"

                        value={stats.profileViews}

                    />

                </div>

            </div>
                        {/* ==========================
                Main Profile Section
            ========================== */}

            <div className="grid lg:grid-cols-3 gap-8">

                {/* ==========================
                    Left Card
                ========================== */}

                <div className="bg-white rounded-3xl shadow-lg overflow-hidden">

                    <div className="bg-gradient-to-r from-pink-500 to-rose-500 h-28"></div>

                    <div className="px-6 pb-8 -mt-16">

                        <div className="flex justify-center">

                            {

                                user.profilePhoto ?

                                (

                                    <img
    src={getImageUrl(user.profilePhoto)}
    alt="Profile"
    className="w-32 h-32 sm:w-40 sm:h-40 rounded-full object-cover border-4 border-white shadow-lg"
/>

                                )

                                :

                                (

                                    <div className="w-32 h-32 sm:w-40 sm:h-40 rounded-full bg-pink-600 border-4 border-white shadow-lg flex items-center justify-center text-white text-5xl sm:text-6xl font-bold">

                                        {user.firstName.charAt(0)}

                                    </div>

                                )

                            }

                        </div>

                        <div className="text-center mt-5">

                            <h2 className="text-3xl font-bold">

                                {user.firstName} {user.lastName}

                            </h2>

                            <p className="text-gray-500 mt-2 flex justify-center items-center gap-2">

                                <FaBriefcase />

                                {

                                    user.occupation ||

                                    "Occupation not provided"

                                }

                            </p>

                            <p className="text-gray-500 mt-2 flex justify-center items-center gap-2">

                                <FaMapMarkerAlt />

                                {

                                    user.location ||

                                    "Location not provided"

                                }

                            </p>

                            <div className="mt-5">

                                <span className="bg-blue-100 text-blue-700 px-5 py-2 rounded-full text-sm font-semibold">

                                    ✔ Verification Coming Soon

                                </span>

                            </div>

                        </div>

                        <div className="mt-8">

                            <ProfilePhotoUploader

                                user={user}

                                refreshProfile={loadProfile}

                            />

                        </div>

                    </div>

                </div>

                {/* ==========================
                    Right Card
                ========================== */}

                <div className="lg:col-span-2 bg-white rounded-3xl shadow-lg p-6 sm:p-8">

                    <div className="flex justify-between items-center flex-wrap gap-3">

                        <h2 className="text-3xl font-bold">

                            Profile Information

                        </h2>

                        <button

                            onClick={() => navigate("/edit-profile")}

                            className="bg-pink-600 hover:bg-pink-700 transition text-white px-5 py-3 rounded-xl flex items-center gap-2"

                        >

                            <FaUserEdit />

                            Edit Profile

                        </button>

                    </div>

                    <div className="grid sm:grid-cols-2 gap-5 mt-8">

                        <Info

                            icon={<FaEnvelope />}

                            title="Email"

                            value={user.email}

                        />

                        <Info

                            title="Age"

                            value={user.age || "Not provided"}

                        />

                        <Info

                            title="Gender"

                            value={user.gender}

                        />

                        <Info

                            title="Interested In"

                            value={user.interestedIn}

                        />

                        <Info

                            title="Relationship Goal"

                            value={user.relationshipGoal}

                        />

                        <Info

                            icon={<FaBriefcase />}

                            title="Occupation"

                            value={

                                user.occupation ||

                                "Not provided"

                            }

                        />

                        <Info

                            title="Company"

                            value={

                                user.company ||

                                "Not provided"

                            }

                        />

                        <Info

                            icon={<FaGraduationCap />}

                            title="Education"

                            value={

                                user.education ||

                                "Not provided"

                            }

                        />

                        <Info

                            icon={<FaMapMarkerAlt />}

                            title="Location"

                            value={

                                user.location ||

                                "Not provided"

                            }

                        />

                    </div>

                    <div className="mt-10 border-t pt-8">

                        <h3 className="text-2xl font-bold">

                            About Me

                        </h3>

                        <p className="text-gray-600 leading-8 mt-4">

                            {

                                user.bio ||

                                "You haven't added a bio yet. Tell people about yourself to increase your chances of getting matches."

                            }

                        </p>

                    </div>

                </div>

            </div>
                        {/* ==========================
                Quick Actions
            ========================== */}

            <div>

                <div className="flex justify-between items-center mb-6 flex-wrap gap-3">

                    <h2 className="text-3xl font-bold">

                        Quick Actions

                    </h2>

                    <p className="text-gray-500">

                        Everything you need is one click away.

                    </p>

                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6">

                    <QuickActionCard
                        icon={<FaUserEdit />}
                        title="Edit Profile"
                        description="Update your profile information."
                        link="/edit-profile"
                    />

                    <QuickActionCard
                        icon={<FaCompass />}
                        title="Discover"
                        description="Find people who match your interests."
                        link="/discover"
                    />

                    <QuickActionCard
                        icon={<FaHeart />}
                        title="Matches"
                        description="See everyone you've matched with."
                        link="/matches"
                    />

                    <QuickActionCard
                        icon={<FaComments />}
                        title="Messages"
                        description="Continue your conversations."
                        link="/messages"
                    />

                </div>

               </div>

            {/* ==========================
                Developer Signature
            ========================== */}

           // <div className="mt-20 mb-6 text-center text-gray-400">

                <div className="text-lg tracking-[0.35em]">
                    ────────────
                </div>

                <p className="mt-4 text-sm uppercase tracking-[0.2em]">
                    Designed &amp; Developed 
                </p>

                <h3 className="mt-2 text-xl font-normal tracking-[0.15em] text-gray-500">
                    G.H.R
                </h3>

            </div>

        </div>

    );

}

        

/* ==========================
   Information Card
========================== */

function Info({

    icon,

    title,

    value

}) {

    return (

        <div className="bg-slate-50 hover:bg-pink-50 transition rounded-2xl p-5 border">

            <div className="flex items-center gap-3 mb-2">

                {

                    icon &&

                    <div className="text-pink-600 text-lg">

                        {icon}

                    </div>

                }

                <h3 className="text-gray-500 text-sm">

                    {title}

                </h3>

            </div>

            <p className="font-semibold text-lg break-words">

                {value}

            </p>

        </div>

    );

}

export default Dashboard;