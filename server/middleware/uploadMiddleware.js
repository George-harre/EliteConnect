const multer = require("multer");
const { CloudinaryStorage } = require("multer-storage-cloudinary");

const cloudinary = require("../config/cloudinary");

// ===================================
// Cloudinary Storage
// ===================================

const storage = new CloudinaryStorage({

    cloudinary,

    params: {

        folder: "EliteConnect/ProfilePhotos",

        allowed_formats: [

            "jpg",

            "jpeg",

            "png",

            "webp"

        ],

        transformation: [

            {

                width: 600,

                height: 600,

                crop: "limit",

                quality: "auto"

            }

        ]

    }

});

// ===================================
// Upload Middleware
// ===================================

const upload = multer({

    storage

});

module.exports = upload;