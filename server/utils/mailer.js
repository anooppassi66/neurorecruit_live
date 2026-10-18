const nodemailer = require('nodemailer');

// Hostinger SMTP — port 465 (SSL) or 587 (STARTTLS)
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || 'smtp.hostinger.com',
  port: Number(process.env.SMTP_PORT) || 465,
  //secure: Number(process.env.SMTP_PORT) !== 587,
  secure : true,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS
  }
});

//const FROM = process.env.SMTP_FROM || `Neurocruit <${process.env.SMTP_USER}>`;
const FROM = 'smit@astraccorp.com'

async function sendOtpEmail(to, otp) {
  await transporter.sendMail({
    from: FROM,
    to,
    subject: 'Your Neurocruit password reset code',
    text: `Your password reset code is ${otp}. It expires in 10 minutes.`,
    html: `
      <div style="font-family:Inter,Arial,sans-serif;max-width:480px;margin:0 auto;padding:32px 24px;color:#1f2937">
        <h2 style="margin:0 0 16px;color:#165dd3">Reset your password</h2>
        <p style="margin:0 0 20px;font-size:14px;line-height:1.6">
          Use the code below to reset your Neurocruit password. It expires in 10 minutes.
        </p>
        <div style="font-size:32px;font-weight:700;letter-spacing:8px;text-align:center;padding:16px;background:#f5f7fa;border-radius:8px;color:#165dd3">
          ${otp}
        </div>
        <p style="margin:20px 0 0;font-size:13px;color:#6b7280">
          If you didn't request this, you can safely ignore this email.
        </p>
      </div>
    `
  });
}

async function sendRegistrationOtpEmail(to, otp) {
  await transporter.sendMail({
    from: FROM,
    to,
    subject: 'Verify your email for Neurocruit',
    text: `Your Neurocruit verification code is ${otp}. It expires in 10 minutes.`,
    html: `
      <div style="font-family:Inter,Arial,sans-serif;max-width:480px;margin:0 auto;padding:32px 24px;color:#1f2937">
        <h2 style="margin:0 0 16px;color:#165dd3">Verify your email</h2>
        <p style="margin:0 0 20px;font-size:14px;line-height:1.6">
          Use the code below to finish creating your Neurocruit account. It expires in 10 minutes.
        </p>
        <div style="font-size:32px;font-weight:700;letter-spacing:8px;text-align:center;padding:16px;background:#f5f7fa;border-radius:8px;color:#165dd3">
          ${otp}
        </div>
        <p style="margin:20px 0 0;font-size:13px;color:#6b7280">
          If you didn't request this, you can safely ignore this email.
        </p>
      </div>
    `
  });
}

module.exports = { sendOtpEmail, sendRegistrationOtpEmail };
