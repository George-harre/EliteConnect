const multer = require("multer");
const path = require("path");
const fs = require("fs");

// ===================================
// Ensure uploads/files exists
// ===================================

const uploadPath = "uploads/files";

if (!fs.existsSync(uploadPath)) {

    fs.mkdirSync(uploadPath, { recursive: true });

}

// ===================================
// Storage
// ===================================

const storage = multer.diskStorage({

    destination: (req, file, cb) => {

        cb(null, uploadPath);

    },

    filename: (req, file, cb) => {

        const uniqueName =

            Date.now() +

            "-" +

            Math.round(Math.random() * 1e9) +

            path.extname(file.originalname);

        cb(null, uniqueName);

    }

});

// ===================================
// Allowed File Types
// ===================================

const allowedTypes = [

    "application/pdf",

    "application/msword",

    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",

    "application/vnd.ms-excel",

    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",

    "application/vnd.ms-powerpoint",

    "application/vnd.openxmlformats-officedocument.presentationml.presentation",

    "application/zip",

    "application/x-rar-compressed",

    "text/plain"

];

// ===================================
// File Filter
// ===================================

const fileFilter = (req, file, cb) => {

    if (allowedTypes.includes(file.mimetype)) {

        cb(null, true);

    }

    else {

        cb(

            new Error("Unsupported file type."),

            false

        );

    }

};

// ===================================
// Upload Middleware
// ===================================

module.exports = multer({

    storage,

    fileFilter,

    limits: {

        fileSize: 20 * 1024 * 1024 // 20MB

    }

});
