const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: "Gmail",
  host: "smtp.gmail.com",
  port: 465,
  secure: true,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

const sentResetMail = async (email, token) => {
  console.log("inside sentResetMail --------------------- ");
  console.log(process.env.EMAIL_PASS);
  const resetLink = `${process.env.FRONTEND_URL}/reset-password/${token}`;
  console.log({ userMail: process.env.EMAIL_USER });
  await transporter.sendMail({
    from: process.env.EMAIL_USER,
    to: email,
    subject: "Password Reset Request",
    html: `<p>Click the link below to reset your password. The link expires in 15 minutes:</p>
             <a href="${resetLink}">${resetLink}</a>`,
  });
};

module.exports = { sentResetMail };
