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
// Get My Matches
// ===============================
export const getMyMatches = async () => {

    const response = await api.get(
        "/likes/matches"
    );

    return response.data;

};