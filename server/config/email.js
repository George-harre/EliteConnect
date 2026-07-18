const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({

    host: "smtp.gmail.com",

    port: 587,

    secure: false,

    requireTLS: true,

    connectionTimeout: 30000,

    greetingTimeout: 30000,

    socketTimeout: 30000,

    family: 4,

    auth: {

        user: process.env.EMAIL_USER,

        pass: process.env.EMAIL_PASS

    }

});

console.log("=================================");
console.log("SMTP CONFIG LOADED");
console.log("Host:", "smtp.gmail.com");
console.log("Port:", 587);
console.log("Secure:", false);
console.log("RequireTLS:", true);
console.log("=================================");

module.exports = transporter;