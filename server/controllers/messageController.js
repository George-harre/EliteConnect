const Message = require("../models/Message");
const Match = require("../models/Match");
const User = require("../models/User");
const Notification = require("../models/Notification");

// ===================================
// Send Text / Image Message
// ===================================
const sendMessage = async (req, res) => {

    try {

        const sender = req.user._id;

        const { receiver, message } = req.body;

        const image = req.file
    ? req.file.path
    : "";

        if (
            (!message || message.trim() === "") &&
            !image
        ) {

            return res.status(400).json({

                message: "Message cannot be empty."

            });

        }

        // Ensure users are matched
        const match = await Match.findOne({

            users: {
                $all: [sender, receiver]
            }

        });

        if (!match) {

            return res.status(403).json({

                message: "You can only message your matches."

            });

        }

        // Determine message type
        let messageType = "text";

        if (message && image) {

            messageType = "text-image";

        }

        else if (image) {

            messageType = "image";

        }

        const newMessage = await Message.create({

            sender,

            receiver,

            message: message || "",

            image,

            messageType

        });

        await newMessage.populate(
            "sender",
            "firstName lastName profilePhoto"
        );

        await newMessage.populate(
            "receiver",
            "firstName lastName profilePhoto"
        );

        const notification = await Notification.create({

            recipient: receiver,

            sender,

            type: "message",

            text:
                messageType === "image"
                    ? "sent you a photo 📷"
                    : "sent you a message 💬"

        });

        await notification.populate(
            "sender",
            "firstName lastName profilePhoto"
        );

        const io = req.app.get("io");

        io.to(receiver.toString()).emit(
            "receiveMessage",
            newMessage
        );

        io.to(receiver.toString()).emit(
            "newNotification",
            notification
        );

        res.status(201).json({

            message: "Message sent successfully.",

            newMessage

        });

    }

    catch (error) {

        res.status(500).json({

            message: error.message

        });

    }

};

// ===================================
// Send Voice Message
// ===================================
const sendVoiceMessage = async (req, res) => {

    try {

        const sender = req.user._id;

        const { receiver } = req.body;

        if (!req.file) {

            return res.status(400).json({

                message: "Voice note is required."

            });

        }

        const match = await Match.findOne({

            users: {
                $all: [sender, receiver]
            }

        });

        if (!match) {

            return res.status(403).json({

                message: "You can only message your matches."

            });

        }

        const newMessage = await Message.create({

            sender,

            receiver,

            voice: req.file.path,

            messageType: "voice"

        });

        await newMessage.populate(
            "sender",
            "firstName lastName profilePhoto"
        );

        await newMessage.populate(
            "receiver",
            "firstName lastName profilePhoto"
        );

        const notification = await Notification.create({

            recipient: receiver,

            sender,

            type: "message",

            text: "sent you a voice note 🎙️"

        });

        await notification.populate(
            "sender",
            "firstName lastName profilePhoto"
        );

        const io = req.app.get("io");

        io.to(receiver.toString()).emit(
            "receiveMessage",
            newMessage
        );

        io.to(receiver.toString()).emit(
            "newNotification",
            notification
        );

        res.status(201).json({

            message: "Voice note sent successfully.",

            newMessage

        });

    }

    catch (error) {

        res.status(500).json({

            message: error.message

        });

    }

};

// ===================================
// Send File Message
// ===================================

const sendFileMessage = async (req, res) => {

    try {

        const sender = req.user._id;

        const { receiver } = req.body;

        if (!req.file) {

            return res.status(400).json({

                message: "No file uploaded."

            });

        }

        // ===================================
        // Ensure users are matched
        // ===================================

        const match = await Match.findOne({

            users: {
                $all: [sender, receiver]
            }

        });

        if (!match) {

            return res.status(403).json({

                message: "You can only message your matches."

            });

        }

        // ===================================
        // Save Message
        // ===================================

        const newMessage = await Message.create({

            sender,

            receiver,

            file: `/uploads/files/${req.file.filename}`,

            fileName: req.file.originalname,

            messageType: "file"

        });

        await newMessage.populate(

            "sender",

            "firstName lastName profilePhoto"

        );

        await newMessage.populate(

            "receiver",

            "firstName lastName profilePhoto"

        );

        // ===================================
        // Notification
        // ===================================

        const notification = await Notification.create({

            recipient: receiver,

            sender,

            type: "message",

            text: `sent you a file 📎`

        });

        await notification.populate(

            "sender",

            "firstName lastName profilePhoto"

        );

        // ===================================
        // Socket.IO
        // ===================================

        const io = req.app.get("io");

        io.to(receiver.toString()).emit(

            "receiveMessage",

            newMessage

        );

        io.to(receiver.toString()).emit(

            "newNotification",

            notification

        );

        res.status(201).json({

            message: "File sent successfully.",

            newMessage

        });

    }

    catch (error) {

        res.status(500).json({

            message: error.message

        });

    }

};

// ===================================
// React to Message
// ===================================
const reactToMessage = async (req, res) => {

    try {

        const userId = req.user._id;

        const { messageId } = req.params;

        const { emoji } = req.body;

        if (!emoji) {

            return res.status(400).json({

                message: "Emoji is required."

            });

        }

        const message = await Message.findById(messageId);

        if (!message) {

            return res.status(404).json({

                message: "Message not found."

            });

        }

        // ===============================
        // Existing reaction?
        // ===============================

        const existingReaction = message.reactions.find(

            reaction =>

                reaction.user.toString() ===

                userId.toString()

        );

        if (existingReaction) {

            // Same emoji = remove reaction

            if (existingReaction.emoji === emoji) {

                message.reactions = message.reactions.filter(

                    reaction =>

                        reaction.user.toString() !==

                        userId.toString()

                );

            }

            // Different emoji = update

            else {

                existingReaction.emoji = emoji;

            }

        }

        else {

            message.reactions.push({

                user: userId,

                emoji

            });

        }

        await message.save();

        await message.populate(

            "reactions.user",

            "firstName lastName profilePhoto"

        );

        // ===============================
        // Socket.IO
        // ===============================

        const io = req.app.get("io");

        io.to(message.sender.toString()).emit(

            "messageReaction",

            message

        );

        io.to(message.receiver.toString()).emit(

            "messageReaction",

            message

        );

        res.status(200).json({

            message: "Reaction updated.",

            updatedMessage: message

        });

    }

    catch (error) {

        res.status(500).json({

            message: error.message

        });

    }

};

// ===================================
// Get One Conversation
// ===================================
const getConversation = async (req, res) => {

    try {

        const currentUser = req.user._id;

        const otherUserId = req.params.userId;

        const otherUser = await User.findById(otherUserId)
            .select("-password");

        if (!otherUser) {

            return res.status(404).json({

                message: "User not found."

            });

        }

        const messages = await Message.find({

            $or: [

                {

                    sender: currentUser,

                    receiver: otherUserId

                },

                {

                    sender: otherUserId,

                    receiver: currentUser

                }

            ]

        })
        .populate(
            "sender",
            "firstName lastName profilePhoto"
        )
        .populate(
            "receiver",
            "firstName lastName profilePhoto"
        )
        .sort({
            createdAt: 1
        });

        // ===================================
        // Read Receipts
        // ===================================

        const unreadMessages = await Message.find({

            sender: otherUserId,

            receiver: currentUser,

            read: false

        });

        if (unreadMessages.length > 0) {

            const unreadIds = unreadMessages.map(

                message => message._id

            );

            await Message.updateMany(

                {

                    _id: {

                        $in: unreadIds

                    }

                },

                {

                    read: true

                }

            );

            const io = req.app.get("io");

            io.to(otherUserId.toString()).emit(

                "messagesRead",

                {

                    reader: currentUser.toString(),

                    sender: otherUserId.toString(),

                    messageIds: unreadIds

                }

            );

        }

        res.status(200).json({

            user: otherUser,

            count: messages.length,

            messages

        });

    }

    catch (error) {

        res.status(500).json({

            message: error.message

        });

    }

};

// ===================================
// Get Conversation List
// ===================================
const getConversations = async (req, res) => {

    try {

        const currentUser = req.user._id;

        const matches = await Match.find({

            users: currentUser

        }).populate(

            "users",

            "-password"

        );

        const conversations = await Promise.all(

            matches.map(async (match) => {

                const otherUser = match.users.find(

                    user =>

                        user._id.toString() !==

                        currentUser.toString()

                );

                const lastMessage = await Message.findOne({

                    $or: [

                        {

                            sender: currentUser,

                            receiver: otherUser._id

                        },

                        {

                            sender: otherUser._id,

                            receiver: currentUser

                        }

                    ]

                })
                .sort({

                    createdAt: -1

                });

                let preview = "Start chatting...";

                if (lastMessage) {

                    switch (lastMessage.messageType) {

                        case "image":
                            preview = "📷 Photo";
                            break;

                        case "voice":
                            preview = "🎙️ Voice note";
                            break;

                        case "file":
                            preview = "📎 File";
                            break;

                        case "text-image":
                            preview = "📷 Photo + Message";
                            break;

                        default:
                            preview = lastMessage.message;

                    }

                }

                return {

                    matchId: match._id,

                    user: otherUser,

                    lastMessage: preview,

                    lastMessageTime: lastMessage
                        ? lastMessage.createdAt
                        : null

                };

            })

        );

        conversations.sort((a, b) => {

            if (!a.lastMessageTime) return 1;

            if (!b.lastMessageTime) return -1;

            return (

                new Date(b.lastMessageTime) -

                new Date(a.lastMessageTime)

            );

        });

        res.status(200).json({

            conversations

        });

    }

    catch (error) {

        res.status(500).json({

            message: error.message

        });

    }

};

// ===============================
// Delete Message (Delete for Everyone)
// ===============================

const deleteMessage = async (req, res) => {

    try {

        const { messageId } = req.params;

        const userId = req.user._id;

        const message = await Message.findById(messageId);

        if (!message) {

            return res.status(404).json({

                message: "Message not found."

            });

        }

        // Only sender can delete

        if (message.sender.toString() !== userId.toString()) {

            return res.status(403).json({

                message: "You can only delete your own messages."

            });

        }

        message.deleted = true;
        message.deletedBy = userId;
        message.deletedAt = new Date();

        await message.save();

        // Notify both users in realtime

        const io = req.app.get("io");

        if (io) {

            io.to(message.sender.toString()).emit(

                "messageDeleted",

                {

                    messageId: message._id,

                    deletedBy: userId

                }

            );

            io.to(message.receiver.toString()).emit(

                "messageDeleted",

                {

                    messageId: message._id,

                    deletedBy: userId

                }

            );

        }

        res.status(200).json({

            message: "Message deleted successfully.",

            deletedMessage: message

        });

    }

    catch (error) {

        res.status(500).json({

            message: error.message

        });

    }

};

module.exports = {

    sendMessage,

    sendVoiceMessage,

    sendFileMessage,

    reactToMessage,

    getConversation,

    deleteMessage,

    getConversations

};