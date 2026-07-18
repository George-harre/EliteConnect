const transporter = require("../config/email");

const sendVerificationEmail = async (
    email,
    firstName,
    verificationToken
) => {

    const verificationLink =
        `${process.env.CLIENT_URL}/verify-email/${verificationToken}`;

    const mailOptions = {

        from: `"EliteConnect ❤️" <${process.env.EMAIL_USER}>`,

        to: email,

        subject: "Verify your EliteConnect account",

        html: `
        <div style="max-width:600px;margin:auto;font-family:Arial,sans-serif;background:#ffffff;padding:40px;border-radius:12px">

            <h1 style="color:#ec4899;margin-bottom:10px;">
                ❤️ Welcome to EliteConnect
            </h1>

            <p style="font-size:16px;">
                Hi <strong>${firstName}</strong>,
            </p>

            <p style="font-size:16px;line-height:1.8;">
                Thank you for joining EliteConnect.
                You're one step away from discovering meaningful connections.
            </p>

            <div style="text-align:center;margin:40px 0;">

                <a
                    href="${verificationLink}"
                    style="
                        background:#ec4899;
                        color:white;
                        text-decoration:none;
                        padding:15px 35px;
                        border-radius:8px;
                        font-size:18px;
                        font-weight:bold;
                        display:inline-block;
                    "
                >
                    Verify My Email
                </a>

            </div>

            <p>
                If the button doesn't work, copy this link:
            </p>

            <p style="word-break:break-all;color:#2563eb;">
                ${verificationLink}
            </p>

        </div>
        `

    };

    try {

        const info = await transporter.sendMail(mailOptions);

        console.log("✅ Verification email sent successfully!");
        console.log(info.response);

    }

    catch (error) {

        console.error("❌ Failed to send verification email:");
        console.error(error);

        throw error;

    }

};

module.exports = sendVerificationEmail;