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
// Send Message (Text / Image)
// ===============================
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