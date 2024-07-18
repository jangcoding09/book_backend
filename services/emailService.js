const nodemailer = require("nodemailer");

// Mailtrap SMTP 설정
const transporter = nodemailer.createTransport({
  host: "smtp.mailtrap.io",
  port: 2525,
  auth: {
    user: "jgw970907@gmail.com",
    pass: "atsnhnrxlxeurqwa",
  },
});

// 이메일 보내기 함수 예시.
const sendEmail = async (toEmail, subject, text) => {
  try {
    const info = await transporter.sendMail({
      from: "jgw970907@gmail.com",
      to: toEmail,
      subject: subject,
      text: text,
    });
    console.log("Email sent: " + info.response);
    return info;
  } catch (error) {
    console.error("Error sending email:", error);
    throw error;
  }
};

module.exports = { sendEmail };
