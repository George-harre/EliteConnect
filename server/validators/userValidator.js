const { body, validationResult } = require("express-validator");

// Validation rules for registration
const validateRegister = [
    body("firstName")
        .trim()
        .notEmpty()
        .withMessage("First name is required."),

    body("lastName")
        .trim()
        .notEmpty()
        .withMessage("Last name is required."),

    body("email")
        .isEmail()
        .withMessage("Please enter a valid email address."),

    body("password")
        .isLength({ min: 8 })
        .withMessage("Password must be at least 8 characters long.")
];

// Middleware to return validation errors
const handleValidationErrors = (req, res, next) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        return res.status(400).json({
            success: false,
            errors: errors.array()
        });
    }

    next();
};

module.exports = {
    validateRegister,
    handleValidationErrors
};