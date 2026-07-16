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

            uniqueName + path.extname(file.originalname)

        );

    }

});

// ===============================
// Images only
// ===============================
const fileFilter = (req, file, cb) => {

    if (file.mimetype.startsWith("image/")) {

        cb(null, true);

    }

    else {

        cb(

            new Error("Only image files are allowed."),

            false

        );

    }

};

module.exports = multer({

    storage,

    fileFilter

});