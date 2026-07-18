const multer = require("multer");
const path = require("path");
const fs = require("fs");

// ===============================
// Ensure uploads/chat exists
// ===============================
const uploadPath = "uploads/chat";

if (!fs.existsSync(uploadPath)) {

    fs.mkdirSync(uploadPath, { recursive: true });

}

// ===============================
// Storage
// ===============================
const storage = multer.diskStorage({

    destination(req, file, cb) {

        cb(null, uploadPath);

    },

    filename(req, file, cb) {

        const uniqueName =

            Date.now() +

            "-" +

            Math.round(Math.random() * 1e9);

        cb(

            null,

            uniqueName +

            path.extname(file.originalname)

        );

    }

});

// ===============================
// Allow Images & Voice Notes
// ===============================
const fileFilter = (req, file, cb) => {

    // Images
    if (file.mimetype.startsWith("image/")) {

        return cb(null, true);

    }

    // Voice Notes
    if (

        file.mimetype === "audio/webm" ||

        file.mimetype === "audio/ogg" ||

        file.mimetype === "audio/mpeg" ||

        file.mimetype === "audio/mp3" ||

        file.mimetype === "audio/wav" ||

        file.mimetype === "audio/x-wav" ||

        file.mimetype === "audio/mp4" ||

        file.mimetype === "audio/m4a"

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

// ===============================
// Upload
// ===============================
module.exports = multer({

    storage,

    fileFilter,

    limits: {

        fileSize: 20 * 1024 * 1024 // 20MB

    }

});