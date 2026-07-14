import { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import {
    FaPaperPlane,
    FaCircle,
    FaCheck,
    FaCheckDouble
} from "react-icons/fa";

import socket from "../../socket";

import {
    getConversation,
    sendMessage
} from "../../services/messageService";

function Chat() {

    const { userId } = useParams();

    const currentUser = JSON.parse(
        localStorage.getItem("user")
    );

    const [user, setUser] = useState(null);
    const [messages, setMessages] = useState([]);
    const [text, setText] = useState("");

    const [onlineUsers, setOnlineUsers] = useState([]);
    const [typing, setTyping] = useState(false);

    const typingTimeout = useRef(null);
    const bottomRef = useRef(null);

    // ==================================
    // Load Conversation
    // ==================================
    useEffect(() => {

        loadConversation();

    }, [userId]);

    // ==================================
    // Socket Connection
    // ==================================
    useEffect(() => {

        socket.connect();

        socket.emit("join", currentUser.id);

        socket.on("receiveMessage", (message) => {

            if (

                message.sender === userId ||

                message.sender?._id === userId

            ) {

                setMessages(prev => [

                    ...prev,

                    message

                ]);

            }

        });

        socket.on("onlineUsers", (users) => {

            setOnlineUsers(users);

        });

        socket.on("typing", () => {

            setTyping(true);

        });

        socket.on("stopTyping", () => {

            setTyping(false);

        });

        // ===============================
        // Read Receipts
        // ===============================

        socket.on("messagesRead", ({ messageIds }) => {

            setMessages(prev =>

                prev.map(message =>

                    messageIds.includes(message._id)

                        ? {
                              ...message,
                              read: true
                          }

                        : message

                )

            );

        });

        return () => {

            socket.off("receiveMessage");

            socket.off("onlineUsers");

            socket.off("typing");

            socket.off("stopTyping");

            socket.off("messagesRead");

            socket.disconnect();

        };

    }, []);

    // ==================================
    // Auto Scroll
    // ==================================
    useEffect(() => {

        bottomRef.current?.scrollIntoView({

            behavior: "smooth"

        });

    }, [messages, typing]);

    // ==================================
    // Load Conversation
    // ==================================
    const loadConversation = async () => {

        try {

            const data = await getConversation(userId);

            setUser(data.user);

            setMessages(data.messages);

        }

        catch (error) {

            console.log(error);

        }

    };

    // ==================================
    // Typing
    // ==================================
    const handleTyping = (value) => {

        setText(value);

        socket.emit("typing", {

            sender: currentUser.id,

            receiver: userId

        });

        clearTimeout(typingTimeout.current);

        typingTimeout.current = setTimeout(() => {

            socket.emit("stopTyping", {

                sender: currentUser.id,

                receiver: userId

            });

        }, 1000);

    };

    // ==================================
    // Send Message
    // ==================================
    const handleSend = async () => {

        if (!text.trim()) return;

        try {

            const response = await sendMessage(

                userId,

                text

            );

            setMessages(prev => [

                ...prev,

                response.newMessage

            ]);

            socket.emit(

                "sendMessage",

                response.newMessage

            );

            socket.emit("stopTyping", {

                sender: currentUser.id,

                receiver: userId

            });

            setText("");

        }

        catch (error) {

            console.log(error);

        }

    };

    const isOnline =

        onlineUsers.includes(userId);

    return (

        <div className="max-w-5xl mx-auto">

            <div className="bg-white rounded-3xl shadow-xl overflow-hidden h-[82vh] flex flex-col">

                {/* Header */}

                <div className="bg-pink-600 text-white p-5 flex items-center gap-4">

                    {

                        user?.profilePhoto ?

                        (

                            <img
                                src={`http://localhost:5000${user.profilePhoto}`}
                                alt=""
                                className="w-14 h-14 rounded-full object-cover"
                            />

                        )

                        :

                        (

                            <div className="w-14 h-14 rounded-full bg-white text-pink-600 flex items-center justify-center font-bold text-xl">

                                {user?.firstName?.charAt(0)}

                            </div>

                        )

                    }

                    <div>

                        <h2 className="text-xl font-bold">

                            {user?.firstName} {user?.lastName}

                        </h2>

                        <div className="flex items-center gap-2 text-sm">

                            <FaCircle
                                className={
                                    isOnline
                                        ? "text-green-400 text-xs"
                                        : "text-gray-300 text-xs"
                                }
                            />

                            {

                                isOnline

                                    ? "Online"

                                    : "Offline"

                            }

                        </div>

                    </div>

                </div>

                {/* Messages */}

                <div className="flex-1 overflow-y-auto bg-pink-50 p-6 space-y-4">

                    {

                        messages.map((msg) => {

                            const mine =

                                msg.sender?._id === currentUser.id ||

                                msg.sender === currentUser.id;

                            return (

                                <div

                                    key={msg._id}

                                    className={

                                        mine

                                            ? "flex justify-end"

                                            : "flex justify-start"

                                    }

                                >

                                    <div

                                        className={

                                            mine

                                                ? "bg-pink-600 text-white rounded-3xl rounded-br-md px-5 py-3 max-w-md shadow"

                                                : "bg-white rounded-3xl rounded-bl-md px-5 py-3 max-w-md shadow"

                                        }

                                    >

                                        <p>

                                            {msg.message}

                                        </p>

                                        <div className="flex justify-between items-center mt-2">

                                            <p

                                                className={

                                                    mine

                                                        ? "text-pink-100 text-xs"

                                                        : "text-gray-400 text-xs"

                                                }

                                            >

                                                {

                                                    new Date(

                                                        msg.createdAt

                                                    ).toLocaleTimeString(

                                                        [],

                                                        {

                                                            hour: "2-digit",

                                                            minute: "2-digit"

                                                        }

                                                    )

                                                }

                                            </p>

                                            {

                                                mine && (

                                                    msg.read ?

                                                        <FaCheckDouble className="text-blue-300 text-xs" />

                                                        :

                                                        <FaCheck className="text-pink-100 text-xs" />

                                                )

                                            }

                                        </div>

                                    </div>

                                </div>

                            );

                        })

                    }

                    {

                        typing && (

                            <div className="italic text-gray-500">

                                {user?.firstName} is typing...

                            </div>

                        )

                    }

                    <div ref={bottomRef}></div>

                </div>

                {/* Input */}

                <div className="border-t p-4 flex gap-4">

                    <input
                        type="text"
                        value={text}
                        placeholder="Type your message..."
                        onChange={(e)=>handleTyping(e.target.value)}
                        onKeyDown={(e)=>{

                            if(e.key==="Enter"){

                                handleSend();

                            }

                        }}
                        className="flex-1 border rounded-full px-6 py-3 focus:ring-2 focus:ring-pink-500 outline-none"
                    />

                    <button
                        onClick={handleSend}
                        className="bg-pink-600 hover:bg-pink-700 text-white px-6 rounded-full flex items-center gap-2"
                    >

                        <FaPaperPlane />

                        Send

                    </button>

                </div>

            </div>

        </div>

    );

}

export default Chat;