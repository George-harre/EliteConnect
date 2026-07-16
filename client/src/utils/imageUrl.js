const API_BASE = (
    import.meta.env.VITE_API_URL || "http://localhost:5000/api"
).replace("/api", "");

export const getImageUrl = (path) => {

    if (!path) {

        return "https://placehold.co/400x400?text=No+Photo";

    }

    if (path.startsWith("http")) {

        return path;

    }

    return `${API_BASE}${path}`;

};