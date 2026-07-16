import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { FaBell } from "react-icons/fa";

import socket from "../socket";

import {
    getNotifications
} from "../services/notificationService";

function NotificationBell() {

    const currentUser = JSON.parse(
        localStorage.getItem("user")
    );

    const [count, setCount] = useState(0);

    // Prevent notification sound on first load
    const firstLoad = useRef(true);

    // Notification sound
    const notificationSound = useRef(
        new Audio("/sounds/notification.mp3")
    );

    // ===================================
    // Load Notifications
    // ===================================

    const loadNotifications = async () => {

        try {

            const data = await getNotifications();

            const unread = data.notifications.filter(

                notification => !notification.read

            );

            setCount(unread.length);

        }

        catch (error) {

            console.log(error);

        }

    };

    useEffect(() => {

        if (!currentUser) return;

        loadNotifications();

        socket.connect();

        socket.emit(
            "join",
            currentUser.id
        );

        // ===============================
        // New Notification
        // ===============================

        const handleNewNotification = () => {

            setCount(previous => previous + 1);

            if (!firstLoad.current) {

                notificationSound.current.currentTime = 0;

                notificationSound.current.play().catch(() => {});

            }

        };

        // ===============================
        // Local Update (when Notifications page is opened)
        // ===============================

        const handleNotificationsUpdated = () => {

            loadNotifications();

        };

        // ===============================
        // Refresh when browser regains focus
        // ===============================

        const handleWindowFocus = () => {

            loadNotifications();

        };

        socket.on(
            "newNotification",
            handleNewNotification
        );

        window.addEventListener(
            "notificationsUpdated",
            handleNotificationsUpdated
        );

        window.addEventListener(
            "focus",
            handleWindowFocus
        );

        firstLoad.current = false;

        return () => {

            socket.off(
                "newNotification",
                handleNewNotification
            );

            window.removeEventListener(
                "notificationsUpdated",
                handleNotificationsUpdated
            );

            window.removeEventListener(
                "focus",
                handleWindowFocus
            );

        };

    }, []);

    return (

        <Link
            to="/notifications"
            className="relative"
        >

            <FaBell
                className="text-2xl hover:text-pink-600 transition duration-300"
            />

            {

                count > 0 && (

                    <span
                        className="absolute -top-2 -right-2 bg-red-600 text-white text-xs rounded-full min-w-[20px] h-5 px-1 flex items-center justify-center font-bold animate-pulse shadow-lg"
                    >

                        {

                            count > 99

                                ? "99+"

                                : count

                        }

                    </span>

                )

            }

        </Link>

    );

}

export default NotificationBell;