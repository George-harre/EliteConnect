const nodemailer = require("nodemailer");
const dns = require("dns");

const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: false,
    requireTLS: true,

    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    },

    lookup(hostname, options, callback) {
        return dns.lookup(hostname, { family: 4 }, callback);
    }
});

module.exports = transporter;