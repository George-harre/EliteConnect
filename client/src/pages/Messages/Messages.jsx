import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { FaComments } from "react-icons/fa";

import { getConversations } from "../../services/messageService";
import { getImageUrl } from "../../utils/imageUrl";

function Messages() {

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

                conversations.length === 0

                ? (

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

                )

                : (

                    <div className="space-y-5">

                        {

                            conversations.map((conversation) => (

                                <Link

                                    key={conversation.matchId}

                                    to={`/messages/${conversation.user._id}`}

                                    className="block"

                                >

                                    <div className="bg-white rounded-2xl shadow-md hover:shadow-xl hover:scale-[1.01] transition-all duration-300 p-5 flex items-center gap-5">

                                        {

                                            conversation.user.profilePhoto

                                            ? (

                                                <img

                                                    src={getImageUrl(conversation.user.profilePhoto)}

                                                    alt={`${conversation.user.firstName} ${conversation.user.lastName}`}

                                                    className="w-16 h-16 rounded-full object-cover border-2 border-pink-300"

                                                />

                                            )

                                            : (

                                                <div className="w-16 h-16 rounded-full bg-pink-500 text-white flex items-center justify-center text-2xl font-bold">

                                                    {

                                                        conversation.user.firstName.charAt(0)

                                                    }

                                                </div>

                                            )

                                        }

                                        <div className="flex-1 min-w-0">

                                            <h2 className="text-xl font-bold">

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

                                        {

                                            conversation.lastMessageTime && (

                                                <div className="text-sm text-gray-400 whitespace-nowrap">

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

                                    </div>

                                </Link>

                            ))

                        }

                    </div>

                )

            }

        </div>

    );

}

export default Messages;