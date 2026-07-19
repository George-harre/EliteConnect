const multer = require("multer");
const { CloudinaryStorage } = require("multer-storage-cloudinary");

const cloudinary = require("../config/cloudinary");

// ===================================
// Cloudinary Storage
// ===================================

const storage = new CloudinaryStorage({

    cloudinary,

    params: async (req, file) => {

        // Images
        if (file.mimetype.startsWith("image/")) {

            return {

                folder: "EliteConnect/ChatImages",

                resource_type: "image",

                allowed_formats: [

                    "jpg",

                    "jpeg",

                    "png",

                    "webp",

                    "gif"

                ]

            };

        }

        // Voice Notes
        return {

            folder: "EliteConnect/VoiceNotes",

            resource_type: "video"

        };

    }

});

// ===================================
// Allow Images & Voice Notes
// ===================================

const fileFilter = (req, file, cb) => {

    if (file.mimetype.startsWith("image/")) {

        return cb(null, true);

    }

    if (

        file.mimetype.startsWith("audio/")

    ) {

        return cb(null, true);

    }

    cb(

        new Error(

            "Only images and voice notes are allowed."

        ),

        false

    );

};

// ===================================
// Upload
// ===================================

module.exports = multer({

    storage,

    fileFilter,

    limits: {

        fileSize: 20 * 1024 * 1024

    }

});