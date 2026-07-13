function ProfileCompletion({ user }) {
    const fields = [
        user.profilePhoto,
        user.bio,
        user.occupation,
        user.company,
        user.education,
        user.location,
        user.age,
        user.gender,
        user.interestedIn,
        user.relationshipGoal
    ];

    const completedFields = fields.filter(field => {
        if (Array.isArray(field)) {
            return field.length > 0;
        }

        return field !== undefined &&
               field !== null &&
               field !== "";
    }).length;

    const percentage = Math.round(
        (completedFields / fields.length) * 100
    );

    return (
        <div className="bg-white rounded-2xl shadow-lg p-6">

            <div className="flex justify-between items-center mb-3">

                <h2 className="text-xl font-bold">
                    📊 Profile Completion
                </h2>

                <span className="font-bold text-pink-600">
                    {percentage}%
                </span>

            </div>

            <div className="w-full bg-gray-200 rounded-full h-4">

                <div
                    className="bg-pink-600 h-4 rounded-full transition-all duration-700"
                    style={{
                        width: `${percentage}%`
                    }}
                />

            </div>

            <p className="text-gray-500 mt-4">

                {percentage === 100
                    ? "🎉 Amazing! Your profile is complete."
                    : "Complete your profile to receive better matches."}

            </p>

        </div>
    );
}

export default ProfileCompletion;