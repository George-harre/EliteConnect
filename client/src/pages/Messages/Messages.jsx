import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaComments, FaCircle } from "react-icons/fa";

import { getConversations } from "../../services/messageService";
import { getImageUrl } from "../../utils/imageUrl";

function Messages() {

    const navigate = useNavigate();

    const [conversations, setConversations] = useState([]);

    const [loading, setLoading] = useState(true);

    useEffect(() => {

        loadConversations();

    }, []);

    const loadConversations = async () => {

        try {

            const data = await getConversations();

            setConversations(data.conversations);

        }

        catch (error) {

            console.log(error);

        }

        finally {

            setLoading(false);

        }

    };

    if (loading) {

        return (

            <div className="flex justify-center items-center h-[70vh]">

                <h2 className="text-3xl font-bold">

                    Loading conversations...

                </h2>

            </div>

        );

    }

    return (

        <div className="max-w-6xl mx-auto px-4 md:px-6">

            {/* Header */}

            <div className="mb-10">

                <h1 className="text-4xl font-bold flex items-center gap-3">

                    <FaComments className="text-pink-600" />

                    Messages

                </h1>

                <p className="text-gray-500 mt-2">

                    Continue chatting with your matches.

                </p>

            </div>

            {

                conversations.length === 0 ? (

                    <div className="bg-white rounded-3xl shadow-xl p-16 text-center">

                        <div className="text-6xl">

                            💬

                        </div>

                        <h2 className="text-3xl font-bold mt-6">

                            No conversations yet

                        </h2>

                        <p className="text-gray-500 mt-4">

                            Once you match with someone,

                            your conversations will appear here.

                        </p>

                    </div>

                ) : (

                    <div className="space-y-5">

                        {

                            conversations.map((conversation) => (

                                <div

                                    key={conversation.matchId}

                                    className="bg-white rounded-2xl shadow-md hover:shadow-xl hover:scale-[1.01] transition-all duration-300 p-5 flex items-center gap-5"

                                >

                                    {/* Clickable Profile Photo */}

                                    {

                                        conversation.user.profilePhoto ?

                                        (

                                            <img

                                                src={getImageUrl(conversation.user.profilePhoto)}

                                                alt={`${conversation.user.firstName} ${conversation.user.lastName}`}

                                                onClick={() =>

                                                    navigate(`/profile/${conversation.user._id}`)

                                                }

                                                className="w-16 h-16 rounded-full object-cover border-2 border-pink-300 cursor-pointer hover:scale-110 transition"

                                            />

                                        )

                                        :

                                        (

                                            <div

                                                onClick={() =>

                                                    navigate(`/profile/${conversation.user._id}`)

                                                }

                                                className="w-16 h-16 rounded-full bg-pink-500 text-white flex items-center justify-center text-2xl font-bold cursor-pointer hover:scale-110 transition"

                                            >

                                                {

                                                    conversation.user.firstName.charAt(0)

                                                }

                                            </div>

                                        )

                                    }

                                    {/* Conversation Info */}

                                    <div className="flex-1 min-w-0">

                                        {/* Clickable Name */}

                                        <h2

                                            onClick={() =>

                                                navigate(`/profile/${conversation.user._id}`)

                                            }

                                            className="text-xl font-bold cursor-pointer hover:text-pink-600 transition"

                                        >

                                            {conversation.user.firstName}{" "}

                                            {conversation.user.lastName}

                                        </h2>

                                        <p className="text-gray-500 mt-1 truncate">

                                            {

                                                conversation.lastMessage ||

                                                "Start chatting..."

                                            }

                                        </p>

                                    </div>

                                    {/* Right Side */}

                                    <div className="flex flex-col items-end gap-2">

                                        {

                                            conversation.lastMessageTime && (

                                                <div className="text-sm text-gray-400">

                                                    {

                                                        new Date(

                                                            conversation.lastMessageTime

                                                        ).toLocaleTimeString(

                                                            [],

                                                            {

                                                                hour: "2-digit",

                                                                minute: "2-digit"

                                                            }

                                                        )

                                                    }

                                                </div>

                                            )

                                        }

                                        {/* Open Chat */}

                                        <Link

                                            to={`/messages/${conversation.user._id}`}

                                            className="bg-pink-600 hover:bg-pink-700 text-white px-4 py-2 rounded-xl transition flex items-center gap-2"

                                        >

                                            <FaComments />

                                            Chat

                                        </Link>

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

export default Messages;