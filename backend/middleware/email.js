const nodemailer = require('nodemailer');
const { Verification_Email_Template, Welcome_Email_Template } = require("./emailTemplate");

const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: false, // true for port 465, false for other ports
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
    },
});



module.exports.sendVerificationCode = async (email, verificationCode) => {
    try {
        const response = await transporter.sendMail({
            from: `"EduConnect" <${process.env.EMAIL_USER}>`,
            to: email,
            subject: "Verify your email",
            text: "Verify your email for EduConnect",
            html: Verification_Email_Template.replace("{verificationCode}", verificationCode)
        });
        console.log('Email sent successfully', response);
    } catch (error) {
        console.log('Email error:', error);
    }
};


module.exports.sendWelcomeEmail = async (email, name) => {
    try {
        const response = await transporter.sendMail({
            from: `"EduConnect" <${process.env.EMAIL_USER}>`,
            to: email,
            subject: "Welcome",
            text: "Welcome to EduConnect!",
            html: Welcome_Email_Template.replace("{name}", name)
        });
        console.log('Welcome email sent successfully', response);
    } catch (error) {
        console.log('Email error:', error);
    }
}