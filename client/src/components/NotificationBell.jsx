import { useEffect, useState } from "react";
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

        };

        // ===============================
        // Notifications Read
        // ===============================
        const handleNotificationsRead = () => {

            loadNotifications();

        };

        socket.on(
            "newNotification",
            handleNewNotification
        );

        socket.on(
            "notificationsRead",
            handleNotificationsRead
        );

        return () => {

            socket.off(
                "newNotification",
                handleNewNotification
            );

            socket.off(
                "notificationsRead",
                handleNotificationsRead
            );

        };

    }, []);

    const loadNotifications = async () => {

        try {

            const data =
                await getNotifications();

            const unread =
                data.notifications.filter(

                    notification => !notification.read

                );

            setCount(
                unread.length
            );

        }

        catch (error) {

            console.log(error);

        }

    };

    return (

        <Link
            to="/notifications"
            className="relative"
        >

            <FaBell
                className="text-2xl"
            />

            {

                count > 0 &&

                <span
                    className="absolute -top-2 -right-2 bg-red-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center"
                >

                    {

                        count > 99

                        ? "99+"

                        : count

                    }

                </span>

            }

        </Link>

    );

}

export default NotificationBell;