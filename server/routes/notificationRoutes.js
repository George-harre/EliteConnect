const express = require("express");

const router = express.Router();

const protect = require("../middleware/authMiddleware");

const {

    getNotifications,

    markNotificationsAsRead

} = require("../controllers/notificationController");

// Get all notifications
router.get(
    "/",
    protect,
    getNotifications
);

// Mark all as read
router.put(
    "/read",
    protect,
    markNotificationsAsRead
);

module.exports = router;