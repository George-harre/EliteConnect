import { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import {
    FaPaperPlane,
    FaCircle,
    FaCheck,
    FaCheckDouble,
    FaSmile,
    FaPaperclip
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

const isOnline = onlineUsers.includes(userId);

return (

<div className="max-w-6xl mx-auto px-2 sm:px-4">

<div className="bg-white rounded-3xl shadow-2xl overflow-hidden h-[82vh] sm:h-[84vh] flex flex-col">

{/* ================= Header ================= */}

<div className="bg-gradient-to-r from-pink-600 to-rose-500 text-white px-4 sm:px-6 py-4 flex items-center justify-between shadow-md">

<div className="flex items-center gap-4">

{

user?.profilePhoto ?

(

<img

src={`http://localhost:5000${user.profilePhoto}`}

alt="Profile"

className="w-14 h-14 rounded-full object-cover border-2 border-white"

/>

)

:

(

<div className="w-14 h-14 rounded-full bg-white text-pink-600 flex items-center justify-center text-2xl font-bold">

{user?.firstName?.charAt(0)}

</div>

)

}

<div>

<h2 className="font-bold text-xl">

{user?.firstName} {user?.lastName}

</h2>

<div className="flex items-center gap-2 mt-1">

<FaCircle

className={`text-[10px] ${

isOnline

? "text-green-300"

: "text-gray-300"

}`}

/>

<span className="text-sm">

{isOnline

? "Online"

: "Offline"}

</span>

</div>

</div>

</div>

</div>

{/* ================= Messages ================= */}

<div className="flex-1 overflow-y-auto bg-gradient-to-b from-pink-50 via-white to-pink-50 px-3 sm:px-6 py-6 space-y-5">

{

messages.map((msg) => {

const mine =

msg.sender?._id === currentUser.id ||

msg.sender === currentUser.id;

return (

<div

key={msg._id}

className={`flex ${

mine

? "justify-end"

: "justify-start"

}`}

>

<div

className={`max-w-[85%] sm:max-w-md rounded-3xl px-5 py-3 shadow-md transition hover:shadow-lg ${

mine

? "bg-gradient-to-r from-pink-600 to-rose-500 text-white rounded-br-md"

: "bg-white rounded-bl-md"

}`}

>

<p className="leading-relaxed break-words">

{msg.message}

</p>

<div className="flex justify-between items-center mt-3">

<p

className={`text-xs ${

mine

? "text-pink-100"

: "text-gray-400"

}`}

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

<FaCheckDouble

className="text-sky-300 text-xs"

/>

:

<FaCheck

className="text-pink-100 text-xs"

/>

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

<div className="flex">

<div className="bg-white rounded-full px-5 py-2 shadow text-gray-500 italic animate-pulse">

💬 {user?.firstName} is typing...

</div>

</div>

)

}

<div ref={bottomRef}></div>

</div>

                {/* ================= Input Area ================= */}

                <div className="border-t bg-white px-3 sm:px-5 py-4">

                    <div className="flex items-center gap-3">

                        {/* Emoji Button */}

                        <button
                            type="button"
                            className="hidden sm:flex w-11 h-11 rounded-full hover:bg-pink-100 items-center justify-center transition"
                        >
                            <FaSmile className="text-pink-600 text-lg" />
                        </button>

                        {/* Attachment Button */}

                        <button
                            type="button"
                            className="hidden sm:flex w-11 h-11 rounded-full hover:bg-pink-100 items-center justify-center transition"
                        >
                            <FaPaperclip className="text-pink-600 text-lg" />
                        </button>

                        {/* Message Input */}

                        <input
                            type="text"
                            value={text}
                            placeholder="Type your message..."

                            onChange={(e) =>
                                handleTyping(e.target.value)
                            }

                            onKeyDown={(e) => {

                                if (e.key === "Enter") {

                                    handleSend();

                                }

                            }}

                            className="flex-1 bg-pink-50 border border-pink-200 rounded-full px-6 py-3 outline-none focus:ring-2 focus:ring-pink-500 transition"

                        />

                        {/* Send Button */}

                        <button

                            onClick={handleSend}

                            disabled={!text.trim()}

                            className={`rounded-full w-12 h-12 flex items-center justify-center transition-all duration-300 shadow-lg

                            ${
                                text.trim()

                                    ? "bg-pink-600 hover:bg-pink-700 hover:scale-105 text-white"

                                    : "bg-gray-300 text-gray-500 cursor-not-allowed"
                            }`}

                        >

                            <FaPaperPlane />

                        </button>

                    </div>

                </div>

            </div>

        </div>

    );

}

export default Chat;