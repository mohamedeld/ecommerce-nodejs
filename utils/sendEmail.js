const nodemailer = require("nodemailer");

const sendEmail = async (options)=>{
    const transporter = nodemailer.createTransport({
      host: process.env.EMAIL_HOST,
      port: process.env.EMAIL_PORT,
      secure: true,
      auth: {
        user: process.env.EMAIL_USERNAME,
        pass: process.env.EMAIL_PASSWORD,
      },
    });
    const mailOptions = {
        from:"E-shop App <mohamedhassan32023@gmail.com",
        to:options.email,
        subject:options.subject,
        text:options.text
    }

    await transporter.sendMail(mailOptions);
}
module.exports = sendEmail;