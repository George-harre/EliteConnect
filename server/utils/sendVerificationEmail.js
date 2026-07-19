const axios = require("axios");

const sendVerificationEmail = async (
    email,
    firstName,
    verificationToken
) => {

    const verificationLink =
        `${process.env.CLIENT_URL}/verify-email/${verificationToken}`;

    try {

        const response = await axios.post(

            "https://api.brevo.com/v3/smtp/email",

            {
                sender: {
                    name: "EliteConnect ❤️",
                    email: process.env.EMAIL_USER
                },

                to: [
                    {
                        email
                    }
                ],

                subject: "Verify your EliteConnect account",

                htmlContent: `
                <div style="max-width:600px;margin:auto;font-family:Arial,sans-serif;background:#ffffff;padding:40px;border-radius:12px">

                    <h1 style="color:#ec4899;">
                        ❤️ Welcome to EliteConnect
                    </h1>

                    <p>Hi <strong>${firstName}</strong>,</p>

                    <p>
                        Thank you for joining EliteConnect.
                        Please verify your email by clicking the button below.
                    </p>

                    <div style="margin:35px 0;text-align:center;">

                        <a
                            href="${verificationLink}"
                            style="
                                background:#ec4899;
                                color:white;
                                padding:15px 35px;
                                text-decoration:none;
                                border-radius:8px;
                                display:inline-block;
                                font-weight:bold;
                            "
                        >
                            Verify Email
                        </a>

                    </div>

                    <p>If the button doesn't work:</p>

                    <p style="word-break:break-all;">
                        ${verificationLink}
                    </p>

                </div>
                `
            },

            {
                headers: {

                    "accept": "application/json",

                    "content-type": "application/json",

                    "api-key": process.env.BREVO_API_KEY

                }

            }

        );

        console.log("✅ Verification email sent!");
        console.log(response.data);

    }

    catch (error) {

        console.error("❌ Brevo API Error");

        console.error(
            error.response?.data || error.message
        );

        throw error;

    }

};

module.exports = sendVerificationEmail;