import api from "./api";

export const uploadProfilePhoto = async (imageFile) => {

    const formData = new FormData();

    formData.append("profilePhoto", imageFile);

    const response = await api.put(
        "/users/profile/photo",
        formData,
        {
            headers: {
                "Content-Type": "multipart/form-data"
            }
        }
    );

    return response.data;
};