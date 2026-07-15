const API_BASE = import.meta.env.VITE_API_URL.replace("/api", "");

export const getImageUrl = (path) => {

    if (!path) {

        return "https://placehold.co/400x400?text=No+Photo";

    }

    return `${API_BASE}${path}`;

};