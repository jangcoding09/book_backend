require("dotenv").config();
const express = require("express");
const nodemailer = require("nodemailer");

const router = express.Router();

router.post("/send-code", async (req, res) => {
  const { email } = req.body;

  const verificationCode = Math.floor(
    100000 + Math.random() * 900000
  ).toString();

  try {
    let transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    let mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: "Email Verification Code",
      text: `Your verification code is: ${verificationCode}`,
    };

    await transporter.sendMail(mailOptions);

    if (!global.verificationCodes) global.verificationCodes = {};
    global.verificationCodes[email] = {
      code: verificationCode,
      expiresAt: Date.now() + 10 * 60 * 1000,
    };

    res.status(200).json({ message: "Verification code sent." });
  } catch (error) {
    console.error("Error sending email:", error);
    res.status(500).json({ message: "Failed to send verification code." });
  }
});

router.post("/verify-code", async (req, res) => {
  const { email, code } = req.body;

  try {
    if (global.verificationCodes && global.verificationCodes[email]) {
      const storedCode = global.verificationCodes[email].code;

      if (code === storedCode) {
        res
          .status(200)
          .json({ message: "Verification code matched. Proceed with signup." });
      } else {
        res.status(400).json({ message: "Verification code does not match." });
      }
    } else {
      res.status(400).json({ message: "Verification code not found." });
    }
  } catch (error) {
    console.error("Error verifying code:", error);
    res.status(500).json({ message: "Failed to verify code." });
  }
});

module.exports = router;
