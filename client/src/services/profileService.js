import api from "./api";

// ===============================
// Get User Profile
// ===============================
export const getProfile = async (userId) => {

    const response = await api.get(

        `/profile/${userId}`

    );

    return response.data;

};