import { io } from "socket.io-client";

const SOCKET_URL =
    import.meta.env.MODE === "development"
        ? "http://localhost:5000"
        : "https://eliteconnect-x6xw.onrender.com";

const socket = io(SOCKET_URL, {
    autoConnect: false,
    transports: ["websocket"]
});

export default socket;