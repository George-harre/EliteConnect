import api from "./api";

export const likeUser = async (receiver) => {
    const response = await api.post("/likes", {
        receiver
    });

    return response.data;
};