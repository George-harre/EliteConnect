const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({

    host: "smtp-relay.brevo.com",

    port: 587,

    secure: false,

    requireTLS: true,

    auth: {

        user: process.env.EMAIL_USER,

        pass: process.env.EMAIL_PASS

    }

});

console.log("=================================");
console.log("SMTP CONFIG LOADED");
console.log("Host:", "smtp-relay.brevo.com");
console.log("Port:", 587);
console.log("=================================");

module.exports = transporter;