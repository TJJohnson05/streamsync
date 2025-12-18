const express = require("express");
const nodemailer = require("nodemailer");

const app = express();
app.use(express.json());

const INTERNAL_KEY = process.env.INTERNAL_KEY;

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

app.post("/internal/send-verify-email", async (req, res) => {
  try {
    // Simple internal auth
    const key = req.header("X-INTERNAL-KEY");
    if (!INTERNAL_KEY || key !== INTERNAL_KEY) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const { toEmail, verifyUrl } = req.body;
    if (!toEmail || !verifyUrl) {
      return res.status(400).json({ message: "Missing toEmail or verifyUrl" });
    }

    const transporter = makeTransport();
    await transporter.sendMail({
      from: process.env.FROM_EMAIL || process.env.SMTP_USER,
      to: toEmail,
      subject: "Verify your StreamSync email",
      html: `
        <p>Welcome to StreamSync!</p>
        <p>Please verify your email to complete registration:</p>
        <p><a href="${verifyUrl}">Verify Email</a></p>
        <p>If you didn’t create this account, you can ignore this email.</p>
      `,
    });

    return res.json({ message: "Verification email sent." });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Email send failed", error: err.message });
  }
});

app.listen(5050, "0.0.0.0", () => {
  console.log("Email service listening on port 5050");
});

