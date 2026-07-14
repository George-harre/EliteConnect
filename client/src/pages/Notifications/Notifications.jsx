import { useEffect, useState } from "react";

import socket from "../../socket";

import {
    getNotifications,
    markNotificationsRead
} from "../../services/notificationService";

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

            // Tell the notification bell
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

                Notifications

            </h1>

            <div className="space-y-4">

                {

                    notifications.length === 0

                    ? (

                        <div className="bg-white rounded-xl shadow p-6 text-center text-gray-500">

                            No notifications yet.

                        </div>

                    )

                    : (

                        notifications.map(notification => (

                            <div

                                key={notification._id}

                                className={`p-5 rounded-xl shadow transition-all duration-300 ${
                                    notification.read
                                        ? "bg-white"
                                        : "bg-pink-100 border-l-4 border-pink-600"
                                }`}

                            >

                                <p>

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

                        ))

                    )

                }

            </div>

        </div>

    );

}

export default Notifications;