import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { FaComments } from "react-icons/fa";
import { getConversations } from "../../services/messageService";

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

            <h2 className="text-center text-2xl mt-10">

                Loading conversations...

            </h2>

        );

    }

    return (

        <div className="max-w-6xl mx-auto">

            <h1 className="text-4xl font-bold text-pink-600 mb-8 flex items-center gap-3">

                <FaComments />

                Messages

            </h1>

            {

                conversations.length === 0

                ? (

                    <div className="bg-white rounded-3xl shadow-lg p-10 text-center">

                        <h2 className="text-2xl font-bold">

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

                            conversations.map(conversation => (

                                <Link

                                    key={conversation.matchId}

                                    to={`/messages/${conversation.user._id}`}

                                    className="block"

                                >

                                    <div className="bg-white rounded-2xl shadow-md p-5 hover:shadow-xl hover:scale-[1.02] transition cursor-pointer flex items-center gap-5">

                                        {

                                            conversation.user.profilePhoto

                                            ? (

                                                <img

                                                    src={`http://localhost:5000${conversation.user.profilePhoto}`}

                                                    alt="Profile"

                                                    className="w-16 h-16 rounded-full object-cover"

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

                                        <div className="flex-1">

                                            <h2 className="text-xl font-bold">

                                                {

                                                    conversation.user.firstName

                                                }{" "}

                                                {

                                                    conversation.user.lastName

                                                }

                                            </h2>

                                            <p className="text-gray-500 mt-1">

                                                {

                                                    conversation.lastMessage ||

                                                    "Start chatting..."

                                                }

                                            </p>

                                        </div>

                                        {

                                            conversation.lastMessageTime && (

                                                <div className="text-sm text-gray-400">

                                                    {

                                                        new Date(

                                                            conversation.lastMessageTime

                                                        ).toLocaleTimeString([], {

                                                            hour: "2-digit",

                                                            minute: "2-digit"

                                                        })

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