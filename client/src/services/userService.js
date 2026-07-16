import api from "./api";

// ===============================
// Get Logged-in User Profile
// ===============================
export const getProfile = async () => {
    const response = await api.get("/users/profile");
    return response.data;
};

// ===============================
// Dashboard Statistics
// ===============================
export const getDashboardStats = async () => {
    const response = await api.get("/users/dashboard");
    return response.data;
};

// ===============================
// Update Profile
// ===============================
export const updateProfile = async (profileData) => {
    const response = await api.put(
        "/users/profile",
        profileData
    );

    return response.data;
};

// ===============================
// Upload Profile Photo
// ===============================
export const uploadProfilePhoto = async (formData) => {

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

// ===============================
// Discover Users
// ===============================
export const getUsers = async () => {
    const response = await api.get("/users/discover");
    return response.data;
};