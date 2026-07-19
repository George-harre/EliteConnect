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
    FaTimes,
    FaMicrophone,
    FaStop
} from "react-icons/fa";

import socket from "../../socket";

import {

    getConversation,

    sendMessage,

    sendVoiceMessage,

    sendFileMessage,

    reactToMessage,

    deleteMessage

} from "../../services/messageService";

import { getImageUrl } from "../../utils/imageUrl";

function Chat() {

    const { userId } = useParams();

    const currentUser = JSON.parse(
        localStorage.getItem("user")
    );

    // ==========================
    // MAIN STATE
    // ==========================

    const [user, setUser] = useState(null);
    const [messages, setMessages] = useState([]);
    const [text, setText] = useState("");

    const [onlineUsers, setOnlineUsers] = useState([]);
    const [typing, setTyping] = useState(false);

    // ==========================
    // EMOJI PICKER
    // ==========================

    const [showEmojiPicker, setShowEmojiPicker] =
        useState(false);

    // ==========================
    // IMAGE
    // ==========================

    const [selectedImage, setSelectedImage] =
        useState(null);

    const [imagePreview, setImagePreview] =
        useState("");

    // ==========================
    // FILE
    // ==========================

    const [selectedFile, setSelectedFile] =
        useState(null);

    // ==========================
    // VOICE
    // ==========================

    const [recording, setRecording] =
        useState(false);

    const [voiceBlob, setVoiceBlob] =
        useState(null);

    const [voicePreview, setVoicePreview] =
        useState("");

    // ==========================
    // FULL SCREEN IMAGE
    // ==========================

    const [fullscreenImage, setFullscreenImage] =
        useState("");

    // ==========================
    // MESSAGE REACTIONS
    // ==========================

    const [reactionPicker, setReactionPicker] =
    useState({

        visible: false,

        x: 0,

        y: 0,

        side: "left",

        messageId: null,

        mine: false

    });

const [showDeleteDialog, setShowDeleteDialog] =
    useState(false);

    const reactionEmojis = [
        "❤️",
        "😂",
        "👍",
        "😮",
        "😢",
        "🔥"
    ];

    // ==========================
    // REFS
    // ==========================

    const bottomRef = useRef(null);

    const typingTimeout = useRef(null);

    const fileInputRef = useRef(null);

    const fileUploadRef = useRef(null);

    const mediaRecorderRef = useRef(null);

    const audioChunksRef = useRef([]);
    // ==========================
    // LOAD CONVERSATION
    // ==========================

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

    useEffect(() => {

        loadConversation();

    }, [userId]);

    // ==========================
    // AUTO SCROLL
    // ==========================

    useEffect(() => {

        bottomRef.current?.scrollIntoView({

            behavior: "smooth"

        });

    }, [messages, typing]);

    // ==========================
    // SOCKET CONNECTION
    // ==========================

    useEffect(() => {

        socket.connect();

        socket.emit(

            "join",

            currentUser.id

        );

        // ======================
        // Receive Message
        // ======================

        socket.on(

            "receiveMessage",

            (message) => {

                const senderId =

                    message.sender?._id ||

                    message.sender;

                if (senderId === userId) {

                    setMessages(previous => [

                        ...previous,

                        message

                    ]);

                }

            }

        );

        // ======================
        // Online Users
        // ======================

        socket.on(

            "onlineUsers",

            (users) => {

                setOnlineUsers(users);

            }

        );

        // ======================
        // Typing
        // ======================

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

        // ======================
        // Read Receipts
        // ======================

        socket.on(

            "messagesRead",

            ({ messageIds }) => {

                setMessages(previous =>

                    previous.map(message =>

                        messageIds.includes(message._id)

                            ? {

                                ...message,

                                read: true

                            }

                            : message

                    )

                );

            }

        );

        // ======================
        // Message Reactions
        // ======================

        socket.on(

            "messageReaction",

            (updatedMessage) => {

                setMessages(previous =>

                    previous.map(message =>

                        message._id === updatedMessage._id

                            ? updatedMessage

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

            socket.off("messageReaction");

            socket.disconnect();

        };

    }, [userId]);

    // ==========================
    // ONLINE STATUS
    // ==========================

    const isOnline =

        onlineUsers.includes(userId);

    // ==========================
    // TYPING
    // ==========================

    const handleTyping = (value) => {

        setText(value);

        socket.emit(

            "typing",

            {

                sender: currentUser.id,

                receiver: userId

            }

        );

        clearTimeout(

            typingTimeout.current

        );

        typingTimeout.current =

            setTimeout(() => {

                socket.emit(

                    "stopTyping",

                    {

                        sender: currentUser.id,

                        receiver: userId

                    }

                );

            }, 1000);

    };

    // ==========================
    // OPEN REACTION PICKER
    // ==========================

    const openReactionPicker = (

    event,

    messageId,

    mine

) => {

    event.preventDefault();

    setReactionPicker({

        visible: true,

        x: event.clientX,

        y: event.clientY,

        side: mine ? "right" : "left",

        messageId,

        mine

    });

};
    // ==========================
    // CLOSE REACTION PICKER
    // ==========================

    const closeReactionPicker = () => {

    setReactionPicker({

        visible: false,

        x: 0,

        y: 0,

        side: "left",

        messageId: null,

        mine: false

    });

};
    // ==========================
    // SEND REACTION
    // ==========================

    const handleReaction = async (

        emoji

    ) => {

        try {

            const response =

                await reactToMessage(

                    reactionPicker.messageId,

                    emoji

                );

            setMessages(previous =>

                previous.map(message =>

                    message._id ===

                    response.message._id

                        ? response.message

                        : message

                )

            );

        }

        catch (error) {

            console.log(error);

        }

        closeReactionPicker();

    };

    // ==========================
// DELETE MESSAGE
// ==========================

const handleDeleteMessage = async () => {

    try {

        await deleteMessage(

            reactionPicker.messageId

        );

        setMessages(previous =>

            previous.map(message =>

                message._id === reactionPicker.messageId

                    ? {

                        ...message,

                        deleted: true,

                        deletedBy: currentUser.id

                    }

                    : message

            )

        );

    }

    catch (error) {

        console.log(error);

    }

    finally {

        setShowDeleteDialog(false);

        closeReactionPicker();

    }

};
        // ==========================
    // IMAGE
    // ==========================

    const handleImageSelect = (e) => {

        const file = e.target.files[0];

        if (!file) return;

        setSelectedImage(file);

        setImagePreview(

            URL.createObjectURL(file)

        );

    };

    const removeSelectedImage = () => {

        if (imagePreview) {

            URL.revokeObjectURL(imagePreview);

        }

        setSelectedImage(null);

        setImagePreview("");

        if (fileInputRef.current) {

            fileInputRef.current.value = "";

        }

    };

    // ==========================
    // FILE
    // ==========================

    const handleFileSelect = (e) => {

        const file = e.target.files[0];

        if (!file) return;

        setSelectedFile(file);

    };

    const removeSelectedFile = () => {

        setSelectedFile(null);

        if (fileUploadRef.current) {

            fileUploadRef.current.value = "";

        }

    };

    // ==========================
    // VOICE RECORDING
    // ==========================

    const startRecording = async () => {

        try {

            const stream =

                await navigator.mediaDevices.getUserMedia({

                    audio: true

                });

            const recorder =

                new MediaRecorder(stream);

            mediaRecorderRef.current = recorder;

            audioChunksRef.current = [];

            recorder.ondataavailable = (event) => {

                if (event.data.size > 0) {

                    audioChunksRef.current.push(event.data);

                }

            };

            recorder.onstop = () => {

                const blob = new Blob(

                    audioChunksRef.current,

                    {

                        type: "audio/webm"

                    }

                );

                setVoiceBlob(blob);

                setVoicePreview(

                    URL.createObjectURL(blob)

                );

                stream.getTracks().forEach(track =>

                    track.stop()

                );

            };

            recorder.start();

            setRecording(true);

        }

        catch (error) {

            console.log(error);

            alert("Unable to access microphone.");

        }

    };

    const stopRecording = () => {

        if (!mediaRecorderRef.current) return;

        mediaRecorderRef.current.stop();

        setRecording(false);

    };

    const removeVoiceNote = () => {

        if (voicePreview) {

            URL.revokeObjectURL(voicePreview);

        }

        setVoiceBlob(null);

        setVoicePreview("");

    };

    // ==========================
    // SEND MESSAGE
    // ==========================

    const handleSend = async () => {

        try {

            let response;

            // File

            if (selectedFile) {

                response = await sendFileMessage(

                    userId,

                    selectedFile

                );

            }

            // Voice

            else if (voiceBlob) {

                response = await sendVoiceMessage(

                    userId,

                    voiceBlob

                );

            }

            // Text / Image

            else {

                if (

                    !text.trim() &&

                    !selectedImage

                ) {

                    return;

                }

                response = await sendMessage(

                    userId,

                    text,

                    selectedImage

                );

            }

            // Update UI

            setMessages(previous => [

                ...previous,

                response.newMessage

            ]);

            

            socket.emit(

                "stopTyping",

                {

                    sender: currentUser.id,

                    receiver: userId

                }

            );

            // Reset

            setText("");

            removeSelectedImage();

            removeSelectedFile();

            removeVoiceNote();

            setShowEmojiPicker(false);

        }

        catch (error) {

            console.log(error);

        }

    };
        // ==========================================
    // UI
    // ==========================================

    return (

       <div
    className="
        w-full
        h-screen
        lg:h-[calc(100vh-70px)]

        lg:max-w-screen-2xl
        lg:mx-auto

        p-0
    "
    onClick={closeReactionPicker}
>

           <div
    className="
        bg-white

        h-full
        flex
        flex-col

        overflow-hidden

        rounded-none

        sm:rounded-2xl
        lg:rounded-3xl

        shadow-none
        lg:shadow-2xl
    "
>

                {/* ================= HEADER ================= */}

                <div
    className="
        sticky
        top-0
        z-20

        bg-gradient-to-r
        from-pink-600
        to-rose-500

        text-white

        px-3
        sm:px-6

        py-3
        sm:py-4

        flex
        items-center
        justify-between

        shadow-lg
        backdrop-blur
    "
>

                    <div className="flex items-center gap-4">

                        {

                            user?.profilePhoto

                                ?

                                (

                                    <img

                                        src={getImageUrl(user.profilePhoto)}

                                        alt="Profile"

                                        className="
w-12
h-12

sm:w-14
sm:h-14

rounded-full
object-cover
border-2
border-white
"
/>

                                )

                                :

                                (

                                    <div
    className="
        w-12 h-12
        sm:w-14 sm:h-14
        rounded-full
        bg-white
        text-pink-600
        flex
        items-center
        justify-center
        text-xl
        sm:text-2xl
        font-bold
    "
>

                                        {user?.firstName?.charAt(0)}

                                    </div>

                                )

                        }

                        <div>

                            <h2 className="font-bold text-lg sm:text-xl">
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

                                    {isOnline ? "Online" : "Offline"}

                                </span>

                            </div>

                        </div>

                    </div>

                </div>

                {/* ================= MESSAGES ================= */}

<div
    className="
        flex-1

        overflow-y-auto

        bg-gradient-to-b
        from-pink-50
        via-white
        to-pink-50

        px-1
        sm:px-4
        lg:px-8

        py-4

        space-y-4

        scroll-smooth
    "
>

                    {

                        messages.length === 0

                            ?

                            (

                                <div className="flex flex-col items-center justify-center h-full text-center text-gray-500">

                                    <div
    className="
        w-24
        h-24

        rounded-full

        bg-pink-100

        flex

        items-center

        justify-center

        text-5xl

        shadow-md

        mb-5
    "
>

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

                                        (msg.sender?._id || msg.sender) === currentUser.id;

                                        const currentDate = new Date(msg.createdAt).toDateString();

const previousDate =
    messages.indexOf(msg) > 0
        ? new Date(
              messages[messages.indexOf(msg) - 1].createdAt
          ).toDateString()
        : null;

const showDate = currentDate !== previousDate;

                                    return (
                                        

    <div

    key={msg._id}

    onContextMenu={(e) =>

    openReactionPicker(

        e,

        msg._id,

        mine

    )

}

    className={`

        flex

        ${
            mine
                ? "justify-end"
                : "justify-start"
        }

        animate-[fadeIn_.25s_ease]

    `}
>

                                            <div

                                               className={`
max-w-[92%]
sm:max-w-[80%]
lg:max-w-[72%]
xl:max-w-[65%]

rounded-3xl

px-4
sm:px-6

py-3.5

shadow-md
transition
hover:shadow-lg

${
    mine
        ? "bg-gradient-to-r from-pink-600 to-rose-500 text-white rounded-br-md"
        : "bg-white rounded-bl-md"
}
`}

                                            >

                                                {/* IMAGE */}

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
    className="
        rounded-2xl

        w-full

        max-w-[340px]
        lg:max-w-[420px]

        max-h-[420px]

        object-cover

        cursor-pointer

        hover:scale-[1.02]

        transition-all
        duration-300

        shadow-lg

        mb-3
    "
/>

                                                    )

                                                }

                                                {/* VOICE */}

                                                {

                                                    msg.voice && (

                                                        <audio

                                                            controls

                                                            className="w-full mb-2"

                                                        >

                                                            <source

                                                                src={getImageUrl(msg.voice)}

                                                                type="audio/webm"

                                                            />

                                                        </audio>

                                                    )

                                                }

                                                {/* FILE */}

                                                {

                                                    msg.file && (

                                                        <a

                                                            href={getImageUrl(msg.file)}

                                                            target="_blank"

                                                            rel="noreferrer"

                                                            className="
block
mb-3

bg-blue-50
hover:bg-blue-100

rounded-xl

p-3

border
border-blue-200

transition

text-blue-700

break-all
text-sm
sm:text-base
"
 >

                                                            📎 {msg.fileName || "Attachment"}

                                                        </a>

                                                    )

                                                }

                                                {/* TEXT */}

                                                {
    msg.deleted

        ? (

            <p className="italic text-gray-400">

                {

                    msg.deletedBy?.toString() === currentUser.id

                        ? "🗑️ You deleted this message"

                        : "🗑️ This message was deleted"

                }

            </p>

        )

        : (

            msg.message && (

                <p className="leading-relaxed break-words text-[15px] sm:text-base">

                    {msg.message}

                </p>

            )

        )

}
                                                                                                {/* REACTIONS */}

                                                {

                                                    msg.reactions &&

                                                    msg.reactions.length > 0 && (

                                                        <div className="flex gap-1 mt-2 flex-wrap">

                                                            {

                                                                msg.reactions.map((reaction, index) => (

                                                                    <span

                                                                        key={index}

                                                                        className="
bg-white/90
border
rounded-full

px-2
py-1

text-xs
sm:text-sm

shadow
"

                                                                    >

                                                                        {reaction.emoji}

                                                                    </span>

                                                                ))

                                                            }

                                                        </div>

                                                    )

                                                }

                                                {/* TIME + READ RECEIPTS */}

                                               <div className="flex justify-end items-center gap-2 mt-2">

    <span
        className={`text-[11px] ${
            mine
                ? "text-pink-100"
                : "text-gray-400"
        }`}
    >
        {new Date(msg.createdAt).toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit"
        })}
    </span>

    {mine && (
        msg.read ? (
            <FaCheckDouble
                className="text-sky-300 text-xs"
            />
        ) : (
            <FaCheck
                className="text-pink-100 text-xs"
            />
        )
    )}

</div>

                                            </div>

                                        </div>

                                    );

                                })

                            )

                    }

                    {/* Typing */}

                    {

                        typing && (

                            <div className="flex">

                                <div
className="
bg-white
rounded-full

px-4
sm:px-5

py-2

shadow

text-gray-500
italic
animate-pulse

text-sm
"
>

                                    <div className="flex items-center gap-2">

    <span className="text-pink-500">

        ●

    </span>

    <span>

        {user?.firstName} is typing...

    </span>

</div>

                                </div>

                            </div>

                        )

                    }

                    {/* Auto Scroll */}

                    <div ref={bottomRef}></div>

                </div>

                {/* ================= IMAGE PREVIEW ================= */}

                {

                    imagePreview && (

                        <div className="border-t bg-pink-50 px-5 py-4">

                            <div className="relative inline-block">

                                <img

                                    src={imagePreview}

                                    alt="Preview"

                                    className="
w-28
h-28

sm:w-36
sm:h-36

rounded-xl
object-cover
border
shadow
"
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

                {/* ================= FILE PREVIEW ================= */}

                {

                    selectedFile && (

                        <div className="border-t bg-blue-50 px-3 sm:px-5 py-3 sm:py-4">

                            <div className="
flex
items-center
justify-between

bg-white

rounded-xl

p-3
sm:p-4

shadow

gap-3
">

                                <div>

                                    <p className="font-semibold">

                                        📎 {selectedFile.name}

                                    </p>

                                    <p className="text-sm text-gray-500">

                                        {(selectedFile.size / 1024).toFixed(1)} KB

                                    </p>

                                </div>

                                <button

                                    onClick={removeSelectedFile}

                                    className="bg-red-500 hover:bg-red-600 text-white rounded-full w-8 h-8 flex items-center justify-center"

                                >

                                    <FaTimes />

                                </button>

                            </div>

                        </div>

                    )

                }

                {/* ================= VOICE PREVIEW ================= */}

                {

                    voicePreview && (

                        <div className="border-t bg-pink-50 px-3 sm:px-5 py-3 sm:py-4">

                            <div className="flex items-center gap-2 sm:gap-4">

                                <audio

                                    controls

                                    src={voicePreview}

                                    className="flex-1"

                                />

                                <button

                                    onClick={removeVoiceNote}

                                    className="bg-red-500 hover:bg-red-600 text-white rounded-full w-10 h-10 flex items-center justify-center"

                                >

                                    <FaTimes />

                                </button>

                            </div>

                        </div>

                    )

                }
                                {/* ================= HIDDEN INPUTS ================= */}

                <input

                    ref={fileInputRef}

                    type="file"

                    accept="image/*"

                    onChange={handleImageSelect}

                    className="hidden"

                />

                <input

                    ref={fileUploadRef}

                    type="file"

                    accept=".pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.zip,.rar,.txt"

                    onChange={handleFileSelect}

                    className="hidden"

                />

               {/* ================= INPUT AREA ================= */}

<div
    className="
        border-t
        bg-white

        px-3
        sm:px-5
        lg:px-6

        py-3

        shadow-[0_-2px_12px_rgba(0,0,0,0.04)]
    "
>

                   <div
    className="
        flex
        items-center

        w-full

        gap-1

        bg-gray-50

        rounded-full

        border

        px-2
        py-2

        focus-within:border-pink-400
        focus-within:bg-white

        transition
    "
>
                        {/* Emoji */}

                        <div className="relative flex-shrink-0">
                            <button

                                type="button"

                                onClick={() =>

                                    setShowEmojiPicker(

                                        !showEmojiPicker

                                    )

                                }

                                className="
w-10 h-10
rounded-full
bg-pink-100
hover:bg-pink-200
border border-pink-200
flex items-center justify-center
transition

">

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

                        {/* Image */}

                        <button

                            type="button"

                            onClick={() =>

                                fileInputRef.current.click()

                            }

                            className="
                w-10
                h-10

                rounded-full

                bg-pink-100
                hover:bg-pink-200

                border
                border-pink-200

                flex
                items-center
                justify-center

                transition

                flex-shrink-0
            "


                            title="Send Image"

                        >

                            🖼️

                        </button>

                    


                        {/* Message */}

                        <input
    type="text"
    value={text}
    placeholder="Type a message..."

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

    className="
                flex-1

                w-full

                min-w-0

                px-5
                py-3

                text-base

                rounded-full

                border-2
                border-pink-300

                bg-white

                focus:outline-none
                focus:border-pink-500
            "

/>

                        {/* Send / Voice */}

{

    text.trim() ||

    selectedImage ||

    selectedFile ||

    voiceBlob ? (

        <button

            onClick={handleSend}

            className="
                w-11
                h-11

                rounded-full

                flex
                items-center
                justify-center

                bg-pink-600
                hover:bg-pink-700

                text-white

                transition-all
                duration-300

                shadow-md

                hover:scale-105
            "

        >

            <FaPaperPlane className="text-lg" />

        </button>

    ) : (

        <button

            type="button"

            onClick={

                recording

                    ? stopRecording

                    : startRecording

            }

            className={`
                w-11
                h-11

                rounded-full

                flex
                items-center
                justify-center

                transition-all
                duration-300

                shadow-md

                ${
                    recording
                        ? "bg-red-500 text-white animate-pulse"
                        : "bg-pink-600 hover:bg-pink-700 text-white"
                }
            `}

        >

            {

                recording

                    ?

                    <FaStop className="text-lg" />

                    :

                    <FaMicrophone className="text-lg" />

            }

        </button>

    )

}
                    </div>

                </div>

            </div>

            {/* ================= REACTION PICKER ================= */}

            {
reactionPicker.visible && (

<div

className="
fixed
z-[9999]
bg-white
rounded-2xl
shadow-2xl
border
py-2
"

style={{

top: reactionPicker.y - 70,

left:

reactionPicker.mine

? "auto"

: reactionPicker.x,

right:

reactionPicker.mine

? window.innerWidth - reactionPicker.x

: "auto"

}}

onClick={(e)=>e.stopPropagation()}

>

<div className="flex gap-2 px-3 pb-2">

{

reactionEmojis.map((emoji)=>(

<button

key={emoji}

onClick={()=>

handleReaction(emoji)

}

className="
text-2xl
hover:scale-125
transition
"

>

{emoji}

</button>

))

}

</div>

{

reactionPicker.mine && (

<>

<div className="border-t"></div>

<button

onClick={() => {

    setShowDeleteDialog(true);

}}

className="
w-full
text-left
px-4
py-3
hover:bg-red-50
text-red-600
font-medium
"

>

🗑 Delete Message

</button>

</>

)

}

</div>

)

}


{
showDeleteDialog && (

<div
className="fixed inset-0 z-[99999] bg-black/50 flex items-center justify-center"
>

<div
className="bg-white rounded-2xl shadow-2xl w-[90%] max-w-sm p-6"
>

<h2 className="text-xl font-bold mb-3">

Delete Message?

</h2>

<p className="text-gray-600 mb-6">

This message will be deleted for everyone.

</p>

<div className="flex justify-end gap-3">

<button

onClick={()=>

setShowDeleteDialog(false)

}

className="
px-5
py-2
rounded-lg
border
hover:bg-gray-100
"

>

Cancel

</button>

<button

onClick={handleDeleteMessage}

className="
px-5
py-2
rounded-lg
bg-red-600
hover:bg-red-700
text-white
"

>

Delete

</button>

</div>

</div>

</div>

)
}

            {/* ================= FULL SCREEN IMAGE ================= */}

            {

                fullscreenImage && (

                    <div

                       className="
fixed
inset-0

bg-black/90

z-[9999]

flex
items-center
justify-center

p-3
sm:p-6
"

                        onClick={() =>

                            setFullscreenImage("")

                        }

                    >

                        <button

                           className="
absolute

top-3
right-3

sm:top-6
sm:right-6

text-white

text-2xl
sm:text-3xl

hover:text-pink-400

transition
"

                        >

                            <FaTimes />

                        </button>

                        <img

                            src={fullscreenImage}

                            alt="Full Size"

                            className="
max-w-full
max-h-full

rounded-lg
sm:rounded-xl

shadow-2xl
"

                        />

                    </div>

                )

            }

        </div>

    );

}

export default Chat;