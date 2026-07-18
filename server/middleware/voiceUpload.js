const multer = require("multer");
const path = require("path");
const fs = require("fs");

// ===================================
// Ensure uploads/voice exists
// ===================================

const uploadPath = "uploads/voice";

if (!fs.existsSync(uploadPath)) {

    fs.mkdirSync(uploadPath, {

        recursive: true

    });

}

// ===================================
// Storage
// ===================================

const storage = multer.diskStorage({

    destination(req, file, cb) {

        cb(null, uploadPath);

    },

    filename(req, file, cb) {

        const uniqueName =

            Date.now() +

            "-" +

            Math.round(Math.random() * 1e9) +

            path.extname(file.originalname);

        cb(

            null,

            uniqueName

        );

    }

});

// ===================================
// Allowed Audio Formats
// ===================================

const fileFilter = (req, file, cb) => {

    const allowedTypes = [

        "audio/webm",

        "audio/ogg",

        "audio/mpeg",

        "audio/mp3",

        "audio/wav",

        "audio/x-wav",

        "audio/mp4",

        "audio/m4a"

    ];

    if (allowedTypes.includes(file.mimetype)) {

        return cb(null, true);

    }

    cb(

        new Error(

            "Only audio files are allowed."

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

        fileSize: 15 * 1024 * 1024

    }

});