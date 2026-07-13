import { useState } from "react";
import ImageCropper from "./ImageCropper";
import getCroppedImg from "../utils/cropImage";
import { uploadProfilePhoto } from "../services/uploadService";

function ProfilePhotoUploader({ user, refreshProfile }) {
    const [image, setImage] = useState(null);
    const [crop, setCrop] = useState({ x: 0, y: 0 });
    const [zoom, setZoom] = useState(1);
    const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);
    const [uploading, setUploading] = useState(false);

    const onCropComplete = (_, croppedPixels) => {
        setCroppedAreaPixels(croppedPixels);
    };

    const handleFileSelect = (e) => {
        const file = e.target.files[0];

        if (!file) return;

        const reader = new FileReader();

        reader.onload = () => {
            setImage(reader.result);
        };

        reader.readAsDataURL(file);
    };

    const handleUpload = async () => {
        if (!image || !croppedAreaPixels) return;

        try {
            setUploading(true);

            const croppedBlob = await getCroppedImg(
                image,
                croppedAreaPixels
            );

            const croppedFile = new File(
                [croppedBlob],
                "profile.jpg",
                {
                    type: "image/jpeg"
                }
            );

            await uploadProfilePhoto(croppedFile);

            alert("Profile photo uploaded successfully!");

            setImage(null);

            await refreshProfile();

        } catch (error) {
            alert(
                error.response?.data?.message ||
                "Upload failed."
            );
        } finally {
            setUploading(false);
        }
    };

    return (
        <div style={{ textAlign: "center", marginBottom: "40px" }}>

            <img
                src={
                    user.profilePhoto
                        ? `http://localhost:5000${user.profilePhoto}`
                        : "https://placehold.co/220x220?text=Profile"
                }
                alt="Profile"
                style={{
                    width: 220,
                    height: 220,
                    borderRadius: "50%",
                    objectFit: "cover",
                    border: "4px solid #ff4d6d"
                }}
            />

            <br /><br />

            <input
                type="file"
                accept="image/*"
                onChange={handleFileSelect}
            />

            {image && (
                <div
                    style={{
                        marginTop: "30px",
                        padding: "20px",
                        border: "1px solid #ddd",
                        borderRadius: "10px"
                    }}
                >
                    <h3>Crop Your Photo</h3>

                    <ImageCropper
                        image={image}
                        crop={crop}
                        zoom={zoom}
                        setCrop={setCrop}
                        setZoom={setZoom}
                        onCropComplete={onCropComplete}
                    />

                    <div
                        style={{
                            marginTop: "20px"
                        }}
                    >
                        <label>Zoom</label>

                        <br />

                        <input
                            type="range"
                            min={1}
                            max={3}
                            step={0.1}
                            value={zoom}
                            onChange={(e) =>
                                setZoom(Number(e.target.value))
                            }
                            style={{ width: "300px" }}
                        />
                    </div>

                    <br />

                    <button
                        onClick={handleUpload}
                        disabled={uploading}
                    >
                        {uploading
                            ? "Uploading..."
                            : "Crop & Upload"}
                    </button>
                </div>
            )}
        </div>
    );
}

export default ProfilePhotoUploader;