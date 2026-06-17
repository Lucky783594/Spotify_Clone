const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

const sendOTPEmail = async (toEmail, otp, purpose = "verify") => {
  const subject =
    purpose === "reset"
      ? "Fear Player - Password Reset OTP"
      : "Fear Player - Verify Your Email";

  const heading =
    purpose === "reset" ? "Reset Your Password" : "Verify Your Email";

  const html = `
    style="font-family: Arial, sans-serif; max-width: 480px; margin: 0 auto; background:#121212; color:#fff; padding: 32px; border-radius: 12px;">
        <h1 style="color:#00c3ff; font-size: 28px; margin-bottom: 8px;">Fear Music Player</h1>
        <h2 style="font-size: 20px; margin-bottom: 16px;">${heading}</h2>
        <p style="font-size: 15px; color:#b3b3b3;">Use the OTP below to ${
            purpose === "reset" ? "reset your password" : "verify your account"
            }. This code is valid for 10 minutes.</p>
        <div style="background:#1f1f1f; text-align:center; padding: 20px; border-radius: 8px; margin: 24px 0;">
            <span style="font-size: 32px; font-weight: bold; letter-spacing: 8px; color:#1ed760;">${otp}</span>
        </div>
        <div style="display: flex; justify-content: center;">
             <a href="" draggable="false" target="_blank" style="text-decoration: none;"><span style="background-image: linear-gradient(90deg, #af2896, #509bf5);; text-align:center; padding: 10px 25px; border-radius: 50px; color: #fff; font-size: 20px; font-weight: bold;">OPEN PLAYER</span></a>
        </div>

        <p style="font-size: 13px; color:#727272;">If you did not request this, please ignore this email.</p>
  `;
  return transporter.sendMail({
    from: `Fear Player <${process.env.EMAIL_FROM}>`,
    to: toEmail,
    subject,
    html,
  });
};

module.exports = { sendOTPEmail };