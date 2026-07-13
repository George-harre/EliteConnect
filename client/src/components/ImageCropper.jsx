import { useState } from "react";
import Cropper from "react-easy-crop";

function ImageCropper({
    image,
    crop,
    zoom,
    setCrop,
    setZoom,
    onCropComplete
}) {
    return (
        <div
            style={{
                position: "relative",
                width: "100%",
                height: "400px",
                background: "#333",
                borderRadius: "10px",
                overflow: "hidden"
            }}
        >
            <Cropper
                image={image}
                crop={crop}
                zoom={zoom}
                aspect={1}
                cropShape="round"
                showGrid={false}
                onCropChange={setCrop}
                onZoomChange={setZoom}
                onCropComplete={onCropComplete}
            />
        </div>
    );
}

export default ImageCropper;