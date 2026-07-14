import api from "./api";


// ===============================
// Like a User
// ===============================
export const likeUser = async (receiver) => {

    const response = await api.post(
        "/likes",
        {
            receiver
        }
    );

    return response.data;

};


// ===============================
// Get Likes Received
// ===============================
export const getLikesReceived = async () => {

    const response = await api.get(
        "/likes/received"
    );

    return response.data;

};


// ===============================
// Like Back
// ===============================
export const likeBack = async (senderId) => {

    const response = await api.post(
        `/likes/like-back/${senderId}`
    );

    return response.data;

};


// ===============================
// Ignore a Like
// ===============================
export const ignoreLike = async (senderId) => {

    const response = await api.delete(
        `/likes/ignore/${senderId}`
    );

    return response.data;

};


// ===============================
// Get My Matches
// ===============================
export const getMyMatches = async () => {

    const response = await api.get(
        "/likes/matches"
    );

    return response.data;

};