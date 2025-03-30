const nodemailer = require('nodemailer');
const { Verification_Email_Template, Welcome_Email_Template, Alert_Email_On_Login_Template , Reset_Password_Email_Template } = require("./emailTemplate");

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
            subject: "Email Verification",
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
            subject: "Welcome to EduConnect",
            text: "Greetings from EduConnect!",
            html: Welcome_Email_Template.replace("{name}", name)
        });
        console.log('Welcome email sent successfully', response);
    } catch (error) {
        console.log('Email error:', error);
    }
}




module.exports.sendAlertOnLogin = async (email, name) => {
    try {
        const response = await transporter.sendMail({
            from: `"EduConnect" <${process.env.EMAIL_USER}>`,
            to: email,
            subject: "EduConnect: Account Login Alert",
            text: "Account Login Alert",
            html: Alert_Email_On_Login_Template.replace("{name}", name)
        });
        console.log('Alert email sent successfully', response);
    } catch (error) {
        console.log('Email error:', error);
    }
}




module.exports.sendResetPasswordEmail = async (email, resetLink) => {
    try {
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS,
            },
        });

        const mailOptions = {
            from:`"EduConnect" <${process.env.EMAIL_USER}>`,
            to: email,
            subject: 'Password Reset Request',
            html: Reset_Password_Email_Template.replace("{resetLink}", resetLink),
        };

        await transporter.sendMail(mailOptions);
        console.log("Reset link email sent");
    } catch (error) {
        console.error('Error sending reset email:', error);
    }
}
