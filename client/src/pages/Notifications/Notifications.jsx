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

    useEffect(() => {

        if (!currentUser) return;

        loadNotifications();

        socket.connect();

        socket.emit(
            "join",
            currentUser.id
        );

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

    const loadNotifications = async () => {

        try {

            const data = await getNotifications();

            setNotifications(
                data.notifications
            );

            await markNotificationsRead();

            socket.emit(
                "notificationsRead",
                currentUser.id
            );

        }

        catch (error) {

            console.log(error);

        }

    };

    return (

        <div className="max-w-5xl mx-auto">

            <h1 className="text-3xl font-bold mb-8">

                🔔 Notifications

            </h1>

            <div className="space-y-4">

                {

                    notifications.length === 0

                    ? (

                        <div className="bg-white rounded-3xl shadow-xl p-16 text-center">

                            <div className="text-6xl">

                                🔔

                            </div>

                            <h2 className="text-2xl font-bold mt-5">

                                You're all caught up!

                            </h2>

                            <p className="text-gray-500 mt-3">

                                New likes, matches and messages will appear here.

                            </p>

                        </div>

                    )

                    : (

                        notifications.map(notification => (

                            <div

                                key={notification._id}

                                className={`p-5 rounded-2xl shadow transition-all duration-300 ${

                                    notification.read

                                        ? "bg-white"

                                        : "bg-pink-100 border-l-4 border-pink-600"

                                }`}

                            >

                                <div className="flex items-center gap-4">

                                    <img

                                        src={getImageUrl(notification.sender?.profilePhoto)}

                                        alt={notification.sender?.firstName}

                                        className="w-14 h-14 rounded-full object-cover border-2 border-pink-300"

                                    />

                                    <div className="flex-1">

                                        <p className="text-gray-800">

                                            <strong>

                                                {notification.sender?.firstName}{" "}
                                                {notification.sender?.lastName}

                                            </strong>{" "}

                                            {notification.text}

                                        </p>

                                        <p className="text-sm text-gray-500 mt-2">

                                            {

                                                new Date(

                                                    notification.createdAt

                                                ).toLocaleString()

                                            }

                                        </p>

                                    </div>

                                </div>

                            </div>

                        ))

                    )

                }

            </div>

        </div>

    );

}

export default Notifications;