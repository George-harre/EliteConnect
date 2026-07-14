const Notification = require("../models/Notification");

// ===================================
// Get My Notifications
// ===================================
const getNotifications = async (req, res) => {

    try {

        const notifications = await Notification.find({

            recipient: req.user._id

        })
        .populate(
            "sender",
            "firstName lastName profilePhoto"
        )
        .sort({
            createdAt: -1
        });

        res.status(200).json({

            count: notifications.length,

            notifications

        });

    } catch (error) {

        res.status(500).json({

            message: error.message

        });

    }

};

// ===================================
// Mark All Notifications as Read
// ===================================
const markNotificationsAsRead = async (req, res) => {

    try {

        await Notification.updateMany(

            {

                recipient: req.user._id,

                read: false

            },

            {

                read: true

            }

        );

        res.status(200).json({

            message: "Notifications marked as read."

        });

    } catch (error) {

        res.status(500).json({

            message: error.message

        });

    }

};

module.exports = {

    getNotifications,

    markNotificationsAsRead

};