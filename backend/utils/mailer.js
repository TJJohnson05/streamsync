const nodemailer = require('nodemailer');

function makeTransport() {
  return nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT || 587),
    secure: false, // true for 465, false for 587
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });
}

async function sendVerifyEmail(toEmail, verifyUrl) {
  const transporter = makeTransport();

  await transporter.sendMail({
    from: process.env.FROM_EMAIL || process.env.SMTP_USER,
    to: toEmail,
    subject: 'Verify your StreamSync email',
    html: `
      <p>Welcome to StreamSync!</p>
      <p>Please verify your email to complete registration:</p>
      <p><a href="${verifyUrl}">Verify Email</a></p>
      <p>If you didn’t create this account, you can ignore this email.</p>
    `,
  });
}

module.exports = { sendVerifyEmail };

