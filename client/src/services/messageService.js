import api from "./api";

// ===============================
// Get All Conversations
// ===============================
export const getConversations = async () => {

    const response = await api.get("/messages");

    return response.data;

};

// ===============================
// Get Conversation With One User
// ===============================
export const getConversation = async (userId) => {

    const response = await api.get(
        `/messages/${userId}`
    );

    return response.data;

};

// ===============================
// Send Message
// ===============================
export const sendMessage = async (receiver, message) => {

    const response = await api.post(
        "/messages",
        {
            receiver,
            message
        }
    );

    return response.data;

};