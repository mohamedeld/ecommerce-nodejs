const nodemailer = require("nodemailer");

const sendEmail = async (options)=>{
    const transporter = nodemailer.createTransport({
      host: process.env.EMAIL_HOST,
      port: process.env.EMAIL_PORT,
      secure: true,
      auth: {
        user: process.env.USEREMAIL,
        pass: process.env.USERPASSWORD,
      },
    });
    const mailOptions = {
        from:"E-shop App <mohamedhassan32023@gmail.com",
        to:options.email,
        subject:options.subject,
        text:options.message
    }

    await transporter.sendMail(mailOptions);
}
module.exports = sendEmail;