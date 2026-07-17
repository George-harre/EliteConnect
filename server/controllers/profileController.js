const User = require("../models/User");

// ===================================
// Get User Profile
// ===================================
const getProfile = async (req, res) => {

    try {

        const user = await User.findById(
            req.params.userId
        ).select("-password");

        if (!user) {

            return res.status(404).json({

                message: "User not found."

            });

        }

        res.status(200).json({

            user

        });

    }

    catch (error) {

        res.status(500).json({

            message: error.message

        });

    }

};

// ===================================
// Update Online Status
// ===================================
const updateOnlineStatus = async (
    userId,
    online
) => {

    await User.findByIdAndUpdate(

        userId,

        {

            online,

            lastSeen: new Date()

        }

    );

};

// ===================================
// Update Profile Completion
// ===================================
const updateProfileCompletion = async (
    userId
) => {

    const user = await User.findById(userId);

    if (!user) return;

    let completed = 0;

    if (user.profilePhoto) completed++;
    if (user.bio) completed++;
    if (user.age) completed++;
    if (user.location) completed++;
    if (user.education) completed++;
    if (user.occupation) completed++;
    if (user.company) completed++;
    if (user.interests.length > 0) completed++;
    if (user.gallery.length > 0) completed++;

    const percentage = Math.round(

        (completed / 9) * 100

    );

    user.profileCompleted = percentage;

    await user.save();

};

module.exports = {

    getProfile,

    updateOnlineStatus,

    updateProfileCompletion

};