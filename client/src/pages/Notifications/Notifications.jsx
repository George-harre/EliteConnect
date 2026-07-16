import { useEffect, useState } from "react";

import socket from "../../socket";

import {
    getNotifications,
    markNotificationsRead
} from "../../services/notificationService";

import { getImageUrl } from "../../utils/imageUrl";

function Notifications() {

    const currentUser = JSON.parse(
        localStorage.getItem("user")
    );

    const [notifications, setNotifications] = useState([]);

    // ===================================
    // Load Notifications
    // ===================================

    const loadNotifications = async () => {

        try {

            const data = await getNotifications();

            setNotifications(
                data.notifications
            );

            // Mark every notification as read
            await markNotificationsRead();

            // Update UI immediately
            setNotifications(previous =>
                previous.map(notification => ({
                    ...notification,
                    read: true
                }))
            );

            // Notify NotificationBell immediately
            window.dispatchEvent(
                new Event("notificationsUpdated")
            );

        }

        catch (error) {

            console.log(error);

        }

    };

    useEffect(() => {

        if (!currentUser) return;

        socket.connect();

        socket.emit(
            "join",
            currentUser.id
        );

        loadNotifications();

        // ===============================
        // Live Notifications
        // ===============================

        const handleNewNotification = (notification) => {

            setNotifications(previous => [

                notification,

                ...previous

            ]);

        };

        socket.on(
            "newNotification",
            handleNewNotification
        );

        return () => {

            socket.off(
                "newNotification",
                handleNewNotification
            );

        };

    }, []);

    return (

        <div className="max-w-6xl mx-auto">

            {/* Header */}

            <div className="flex justify-between items-center mb-10">

                <div>

                    <h1 className="text-5xl font-extrabold text-gray-800 flex items-center gap-4">

                        🔔 Notifications

                    </h1>

                    <p className="text-gray-500 mt-2 text-lg">

                        Stay updated with likes, matches and messages.

                    </p>

                </div>

                {

                    notifications.length > 0 && (

                        <div className="bg-pink-100 text-pink-700 px-6 py-3 rounded-2xl font-bold">

                            {notifications.length} Notifications

                        </div>

                    )

                }

            </div>

            {

                notifications.length === 0 ? (

                    <div className="bg-white rounded-3xl shadow-xl p-20 text-center">

                        <div className="text-7xl">

                            🔔

                        </div>

                        <h2 className="text-3xl font-bold mt-6">

                            You're all caught up!

                        </h2>

                        <p className="text-gray-500 mt-3">

                            New likes, matches and messages will appear here.

                        </p>

                    </div>

                ) : (

                    <div className="space-y-6">

                        {

                            notifications.map(notification => (

                                <div

                                    key={notification._id}

                                    className={`bg-white rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-300 p-6 flex items-center gap-5 ${

                                        notification.read

                                            ? ""

                                            : "border-l-4 border-pink-600"

                                    }`}

                                >

                                    <div className="w-14 h-14 rounded-full bg-white border flex items-center justify-center shadow">

                                        <span className="text-2xl">

                                            💬

                                        </span>

                                    </div>

                                    <img

                                        src={getImageUrl(notification.sender?.profilePhoto)}

                                        alt={notification.sender?.firstName}

                                        className="w-16 h-16 rounded-full object-cover border-2 border-pink-300"

                                    />

                                    <div className="flex-1">

                                        <p className="text-lg">

                                            <strong>

                                                {notification.sender?.firstName}{" "}

                                                {notification.sender?.lastName}

                                            </strong>{" "}

                                            {notification.text}

                                        </p>

                                        <p className="text-gray-500 mt-2">

                                            {

                                                new Date(

                                                    notification.createdAt

                                                ).toLocaleString()

                                            }

                                        </p>

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

export default Notifications;