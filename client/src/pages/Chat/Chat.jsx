import { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import EmojiPicker from "emoji-picker-react";

import {
    FaPaperPlane,
    FaCircle,
    FaCheck,
    FaCheckDouble,
    FaSmile,
    FaPaperclip,
    FaTimes
} from "react-icons/fa";

import socket from "../../socket";

import {
    getConversation,
    sendMessage
} from "../../services/messageService";

import { getImageUrl } from "../../utils/imageUrl";

function Chat() {

    const { userId } = useParams();

    const currentUser = JSON.parse(
        localStorage.getItem("user")
    );

    // ==========================
    // State
    // ==========================

    const [user, setUser] = useState(null);

    const [messages, setMessages] = useState([]);

    const [text, setText] = useState("");

    const [onlineUsers, setOnlineUsers] = useState([]);

    const [typing, setTyping] = useState(false);

    const [showEmojiPicker, setShowEmojiPicker] =
        useState(false);

    // Image Attachment

    const [selectedImage, setSelectedImage] =
        useState(null);

    const [imagePreview, setImagePreview] =
        useState("");

    // Fullscreen Viewer

    const [fullscreenImage, setFullscreenImage] =
        useState("");

    const fileInputRef = useRef(null);

    const typingTimeout = useRef(null);

    const bottomRef = useRef(null);

    // ==========================
    // Load Conversation
    // ==========================

    useEffect(() => {

        loadConversation();

    }, [userId]);

    const loadConversation = async () => {

        try {

            const data =
                await getConversation(userId);

            setUser(data.user);

            setMessages(data.messages);

        }

        catch (error) {

            console.log(error);

        }

    };

    // ==========================
    // Socket Connection
    // ==========================

    useEffect(() => {

        socket.connect();

        socket.emit(
            "join",
            currentUser.id
        );

        socket.on(
            "receiveMessage",
            (message) => {

                if (
                    message.sender === userId ||
                    message.sender?._id === userId
                ) {

                    setMessages(previous => [

                        ...previous,

                        message

                    ]);

                }

            }
        );

        socket.on(
            "onlineUsers",
            (users) => {

                setOnlineUsers(users);

            }
        );

        socket.on(
            "typing",
            () => {

                setTyping(true);

            }
        );

        socket.on(
            "stopTyping",
            () => {

                setTyping(false);

            }
        );

        socket.on(
            "messagesRead",
            ({ messageIds }) => {

                setMessages(previous =>

                    previous.map(message =>

                        messageIds.includes(
                            message._id
                        )

                            ? {
                                ...message,
                                read: true
                            }

                            : message

                    )

                );

            }
        );

        return () => {

            socket.off("receiveMessage");

            socket.off("onlineUsers");

            socket.off("typing");

            socket.off("stopTyping");

            socket.off("messagesRead");

            socket.disconnect();

        };

    }, []);

        // ==========================
    // Typing
    // ==========================

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

    // ==========================
    // Image Selection
    // ==========================

    const handleImageSelect = (e) => {

        const file = e.target.files[0];

        if (!file) return;

        setSelectedImage(file);

        setImagePreview(

            URL.createObjectURL(file)

        );

    };

    // ==========================
    // Remove Selected Image
    // ==========================

    const removeSelectedImage = () => {

        setSelectedImage(null);

        setImagePreview("");

        if (fileInputRef.current) {

            fileInputRef.current.value = "";

        }

    };

    // ==========================
    // Send Message
    // ==========================

    const handleSend = async () => {

        if (!text.trim() && !selectedImage) {

            return;

        }

        try {

            const response = await sendMessage(

                userId,

                text,

                selectedImage

            );

            setMessages(previous => [

                ...previous,

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

            removeSelectedImage();

            setShowEmojiPicker(false);

        }

        catch (error) {

            console.log(error);

        }

    };

    // ==========================
    // Helpers
    // ==========================

    const isOnline =

        onlineUsers.includes(userId);

    return (

        <div className="max-w-6xl mx-auto px-2 sm:px-4">

            <div className="bg-white rounded-3xl shadow-2xl overflow-hidden h-[82vh] sm:h-[84vh] flex flex-col">

                {/* Header */}

                <div className="bg-gradient-to-r from-pink-600 to-rose-500 text-white px-4 sm:px-6 py-4 flex items-center justify-between shadow-md">

                    <div className="flex items-center gap-4">

                        {

                            user?.profilePhoto

                                ?

                                (

                                    <img

                                        src={getImageUrl(user.profilePhoto)}

                                        alt="Profile"

                                        className="w-14 h-14 rounded-full object-cover border-2 border-white"

                                    />

                                )

                                :

                                (

                                    <div className="w-14 h-14 rounded-full bg-white text-pink-600 flex items-center justify-center text-2xl font-bold">

                                        {

                                            user?.firstName?.charAt(0)

                                        }

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

                                    {

                                        isOnline

                                            ? "Online"

                                            : "Offline"

                                    }

                                </span>

                            </div>

                        </div>

                    </div>

                </div>

                                {/* ================= Messages ================= */}

                <div className="flex-1 overflow-y-auto bg-gradient-to-b from-pink-50 via-white to-pink-50 px-3 sm:px-6 py-6 space-y-5">

                    {

                        messages.length === 0

                            ?

                            (

                                <div className="flex flex-col items-center justify-center h-full text-center text-gray-500">

                                    <div className="text-6xl mb-4">

                                        💬

                                    </div>

                                    <h2 className="text-2xl font-bold">

                                        Start the conversation

                                    </h2>

                                    <p className="mt-2">

                                        Say hello and break the ice.

                                    </p>

                                </div>

                            )

                            :

                            (

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

                                                {

                                                    msg.image && (

                                                        <img

                                                            src={getImageUrl(msg.image)}

                                                            alt="Message"

                                                            onClick={() =>

                                                                setFullscreenImage(

                                                                    getImageUrl(msg.image)

                                                                )

                                                            }

                                                            className="rounded-2xl mb-3 max-w-xs cursor-pointer hover:scale-105 transition shadow-lg"

                                                        />

                                                    )

                                                }

                                                {

                                                    msg.message && (

                                                        <p className="leading-relaxed break-words">

                                                            {msg.message}

                                                        </p>

                                                    )

                                                }

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

                                                            msg.read

                                                                ?

                                                                <FaCheckDouble className="text-sky-300 text-xs" />

                                                                :

                                                                <FaCheck className="text-pink-100 text-xs" />

                                                        )

                                                    }

                                                </div>

                                            </div>

                                        </div>

                                    );

                                })

                            )

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

                {/* ================= Image Preview ================= */}

                {

                    imagePreview && (

                        <div className="border-t bg-pink-50 px-5 py-4">

                            <div className="relative inline-block">

                                <img

                                    src={imagePreview}

                                    alt="Preview"

                                    className="w-36 h-36 rounded-xl object-cover border shadow"

                                />

                                <button

                                    onClick={removeSelectedImage}

                                    className="absolute -top-2 -right-2 bg-red-500 hover:bg-red-600 text-white rounded-full w-7 h-7 flex items-center justify-center shadow"

                                >

                                    <FaTimes />

                                </button>

                            </div>

                        </div>

                    )

                }

                                {/* ================= Hidden File Input ================= */}

                <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleImageSelect}
                    className="hidden"
                />

                {/* ================= Input Area ================= */}

                <div className="border-t bg-white px-3 sm:px-5 py-4">

                    <div className="relative flex items-center gap-3">

                        {/* Emoji Button */}

                        <div className="relative hidden sm:block">

                            <button

                                type="button"

                                onClick={() =>

                                    setShowEmojiPicker(

                                        !showEmojiPicker

                                    )

                                }

                                className="w-11 h-11 rounded-full bg-pink-100 hover:bg-pink-200 border border-pink-200 flex items-center justify-center transition shadow-sm"

                            >

                                <FaSmile className="text-pink-600 text-xl" />

                            </button>

                            {

                                showEmojiPicker && (

                                    <div className="absolute bottom-14 left-0 z-50">

                                        <EmojiPicker

                                            onEmojiClick={(emojiData) => {

                                                setText(

                                                    previous =>

                                                        previous +

                                                        emojiData.emoji

                                                );

                                            }}

                                        />

                                    </div>

                                )

                            }

                        </div>

                        {/* Attachment */}

                        <button

                            type="button"

                            onClick={() =>

                                fileInputRef.current.click()

                            }

                            className="hidden sm:flex w-11 h-11 rounded-full bg-pink-100 hover:bg-pink-200 border border-pink-200 items-center justify-center transition shadow-sm"

                        >

                            <FaPaperclip className="text-pink-600 text-xl" />

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

                                if (

                                    e.key === "Enter" &&

                                    !e.shiftKey

                                ) {

                                    e.preventDefault();

                                    handleSend();

                                }

                            }}

                            className="flex-1 bg-pink-50 border border-pink-200 rounded-full px-6 py-3 outline-none focus:ring-2 focus:ring-pink-500 transition"

                        />

                        {/* Send */}

                        <button

                            onClick={handleSend}

                            disabled={

                                !text.trim() &&

                                !selectedImage

                            }

                            className={`rounded-full w-12 h-12 flex items-center justify-center transition-all duration-300 shadow-lg

                            ${

                                text.trim() ||

                                selectedImage

                                    ?

                                    "bg-pink-600 hover:bg-pink-700 hover:scale-105 text-white"

                                    :

                                    "bg-gray-300 text-gray-500 cursor-not-allowed"

                            }`}

                        >

                            <FaPaperPlane />

                        </button>

                    </div>

                </div>

            </div>

            {/* ================= Fullscreen Image ================= */}

            {

                fullscreenImage && (

                    <div

                        className="fixed inset-0 bg-black/90 z-[9999] flex items-center justify-center p-6"

                        onClick={() =>

                            setFullscreenImage("")

                        }

                    >

                        <button

                            className="absolute top-6 right-6 text-white text-3xl hover:text-pink-400 transition"

                        >

                            <FaTimes />

                        </button>

                        <img

                            src={fullscreenImage}

                            alt="Full Size"

                            className="max-w-full max-h-full rounded-xl shadow-2xl"

                        />

                    </div>

                )

            }

        </div>

    );

}

export default Chat;