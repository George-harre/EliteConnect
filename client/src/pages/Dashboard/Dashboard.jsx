import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import {
    FaHeart,
    FaComments,
    FaUserEdit,
    FaCompass
} from "react-icons/fa";

import {
    getProfile,
    getDashboardStats
} from "../../services/userService";

import ProfilePhotoUploader from "../../components/ProfilePhotoUploader";
import ProfileCompletion from "../../components/ProfileCompletion";
import StatCard from "../../components/StatCard";
import QuickActionCard from "../../components/QuickActionCard";

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

    const loadProfile = async () => {

        try {

            const [profileData, statsData] = await Promise.all([
                getProfile(),
                getDashboardStats()
            ]);

            setUser(profileData.user);
            setStats(statsData);

        }

        catch (error) {

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

            <div className="text-center text-2xl mt-20">

                Loading...

            </div>

        );

    }

    return (

        <div className="space-y-8">

            {/* Welcome */}

            <div className="bg-gradient-to-r from-pink-600 to-rose-500 text-white rounded-3xl p-8 shadow-xl">

                <h1 className="text-4xl font-bold">

                    Welcome back, {user.firstName} 👋

                </h1>

                <p className="mt-3 text-lg opacity-90">

                    Ready to discover meaningful connections today?

                </p>

            </div>

            <ProfileCompletion user={user} />

            {/* Statistics */}

            <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">

                <div
                    className="cursor-pointer"
                    onClick={() => navigate("/matches")}
                >

                    <StatCard
                        icon="💕"
                        title="Matches"
                        value={stats.matches}
                    />

                </div>

                <div
                    className="cursor-pointer"
                    onClick={() => navigate("/likes")}
                >

                    <StatCard
                        icon="👍"
                        title="Likes Received"
                        value={stats.likesReceived}
                    />

                </div>

                <div
                    className="cursor-pointer"
                    onClick={() => navigate("/messages")}
                >

                    <StatCard
                        icon="💬"
                        title="Messages"
                        value={stats.messages}
                    />

                </div>

                <StatCard
                    icon="👀"
                    title="Profile Views"
                    value={stats.profileViews}
                />

            </div>

            {/* Profile */}

            <div className="grid lg:grid-cols-3 gap-8">

                <div className="bg-white rounded-3xl shadow-lg p-8">

                    <div className="flex flex-col items-center">

                        {

                            user.profilePhoto ?

                            (

                                <img
                                    src={`http://localhost:5000${user.profilePhoto}`}
                                    alt="Profile"
                                    className="w-40 h-40 rounded-full object-cover border-4 border-pink-500"
                                />

                            )

                            :

                            (

                                <div className="w-40 h-40 rounded-full bg-pink-500 text-white flex items-center justify-center text-6xl font-bold">

                                    {user.firstName.charAt(0)}

                                </div>

                            )

                        }

                        <h2 className="text-3xl font-bold mt-6">

                            {user.firstName} {user.lastName}

                        </h2>

                        <p className="text-gray-500 mt-2">

                            {user.occupation || "Occupation not provided"}

                        </p>

                        <p className="text-gray-500">

                            {user.location || "Location not provided"}

                        </p>

                        <span className="mt-4 bg-blue-100 text-blue-700 px-4 py-2 rounded-full text-sm">

                            ✔ Verification Coming Soon

                        </span>

                    </div>

                    <div className="mt-8">

                        <ProfilePhotoUploader
                            user={user}
                            refreshProfile={loadProfile}
                        />

                    </div>

                </div>

                <div className="lg:col-span-2 bg-white rounded-3xl shadow-lg p-8">

                    <h2 className="text-2xl font-bold mb-6">

                        Profile Information

                    </h2>

                    <div className="grid md:grid-cols-2 gap-5">

                        <Info title="Email" value={user.email} />

                        <Info title="Age" value={user.age || "Not provided"} />

                        <Info title="Gender" value={user.gender} />

                        <Info title="Interested In" value={user.interestedIn} />

                        <Info title="Relationship Goal" value={user.relationshipGoal} />

                        <Info title="Occupation" value={user.occupation || "Not provided"} />

                        <Info title="Company" value={user.company || "Not provided"} />

                        <Info title="Education" value={user.education || "Not provided"} />

                        <Info title="Location" value={user.location || "Not provided"} />

                    </div>

                    <div className="mt-8">

                        <h3 className="font-bold text-xl">

                            Bio

                        </h3>

                        <p className="text-gray-600 mt-2">

                            {user.bio || "No bio yet."}

                        </p>

                    </div>

                </div>

            </div>

            {/* Quick Actions */}

            <div>

                <h2 className="text-2xl font-bold mb-6">

                    Quick Actions

                </h2>

                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">

                    <QuickActionCard
                        icon={<FaUserEdit />}
                        title="Edit Profile"
                        description="Update your profile information."
                        link="/edit-profile"
                    />

                    <QuickActionCard
                        icon={<FaCompass />}
                        title="Discover"
                        description="Find new people."
                        link="/discover"
                    />

                    <QuickActionCard
                        icon={<FaHeart />}
                        title="Matches"
                        description="View your matches."
                        link="/matches"
                    />

                    <QuickActionCard
                        icon={<FaComments />}
                        title="Messages"
                        description="Continue chatting."
                        link="/messages"
                    />

                </div>

            </div>

        </div>

    );

}

function Info({ title, value }) {

    return (

        <div className="bg-gray-50 rounded-xl p-4">

            <h3 className="text-gray-500 text-sm">

                {title}

            </h3>

            <p className="font-semibold mt-1">

                {value}

            </p>

        </div>

    );

}

export default Dashboard;