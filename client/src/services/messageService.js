import api from "./api";

// ===================================
// Get All Conversations
// ===================================
export const getConversations = async () => {

    const response = await api.get("/messages");

    return response.data;

};

// ===================================
// Get Conversation With One User
// ===================================
export const getConversation = async (userId) => {

    const response = await api.get(`/messages/${userId}`);

    return response.data;

};

// ===================================
// Send Text / Image Message
// ===================================
export const sendMessage = async (

    receiver,

    message,

    image = null

) => {

    const formData = new FormData();

    formData.append("receiver", receiver);

    formData.append("message", message);

    if (image) {

        formData.append("image", image);

    }

    const response = await api.post(

        "/messages",

        formData,

        {

            headers: {

                "Content-Type": "multipart/form-data"

            }

        }

    );

    return response.data;

};

// ===================================
// Send Voice Message
// ===================================
export const sendVoiceMessage = async (

    receiver,

    voiceBlob

) => {

    const formData = new FormData();

    formData.append("receiver", receiver);

    formData.append(

        "voice",

        voiceBlob,

        "voice-note.webm"

    );

    const response = await api.post(

        "/messages/voice",

        formData,

        {

            headers: {

                "Content-Type": "multipart/form-data"

            }

        }

    );

    return response.data;

};

// ===================================
// Send File Message
// ===================================
export const sendFileMessage = async (

    receiver,

    file

) => {

    const formData = new FormData();

    formData.append("receiver", receiver);

    formData.append("file", file);

    const response = await api.post(

        "/messages/file",

        formData,

        {

            headers: {

                "Content-Type": "multipart/form-data"

            }

        }

    );

    return response.data;

};

// ===================================
// React To Message
// ===================================
export const reactToMessage = async (

    messageId,

    emoji

) => {

    const response = await api.post(

        `/messages/${messageId}/react`,

        {

            emoji

        }

    );

    return response.data;

};