import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import { getProfile } from "../../services/profileService";
import { getImageUrl } from "../../utils/imageUrl";

function Profile() {

    const { userId } = useParams();

    const [user, setUser] = useState(null);

    useEffect(() => {

        loadProfile();

    }, []);

    const loadProfile = async () => {

        try {

            const data = await getProfile(userId);

            setUser(data.user);

        }

        catch (error) {

            console.log(error);

        }

    };

    if (!user) {

        return (

            <div className="flex justify-center items-center h-[70vh]">

                <div className="text-xl font-semibold">

                    Loading profile...

                </div>

            </div>

        );

    }

    return (

        <div className="max-w-5xl mx-auto">

            <div className="bg-white rounded-3xl shadow-xl overflow-hidden">

                {/* Cover Photo */}

                <img

                    src={getImageUrl(user.profilePhoto)}

                    alt={user.firstName}

                    className="w-full h-[450px] object-cover"

                />

                {/* Profile Information */}

                <div className="p-8">

                    <h1 className="text-4xl font-bold">

                        {user.firstName} {user.lastName}

                    </h1>

                    <p className="text-lg text-gray-500 mt-2">

                        {user.occupation}

                    </p>

                    <p className="text-gray-500">

                        {user.company}

                    </p>

                    <p className="mt-4">

                        📍 {user.location}
                    </p>

                    <p>

                        🎂 {user.age || "Not specified"}
                    </p>

                    <p>

                        ❤️ Looking for: {user.relationshipGoal}
                    </p>

                    <hr className="my-8" />

                    <h2 className="text-2xl font-bold mb-4">

                        About Me

                    </h2>

                    <p className="text-gray-700 leading-8">

                        {

                            user.bio ||

                            "This user hasn't written a bio yet."

                        }

                    </p>

                    <hr className="my-8" />

                    <h2 className="text-2xl font-bold mb-4">

                        Interests

                    </h2>

                    <div className="flex flex-wrap gap-3">

                        {

                            user.interests.length > 0

                                ? user.interests.map((interest, index) => (

                                    <span

                                        key={index}

                                        className="bg-pink-100 text-pink-700 px-4 py-2 rounded-full"

                                    >

                                        {interest}

                                    </span>

                                ))

                                : (

                                    <p className="text-gray-500">

                                        No interests added yet.

                                    </p>

                                )

                        }

                    </div>

                </div>

            </div>

        </div>

    );

}

export default Profile;