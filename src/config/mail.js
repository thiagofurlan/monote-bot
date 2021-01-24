const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
    host: process.env.MAIL_HOST,
    port: process.env.MAIL_PORT,
    secure: false,
    auth: {
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PASS
    }
});

async function send(to, subject, message) {
    const mail = {
        from: '"Monote" <hello@monote.com.br>',
        to,
        subject,
        html: message,
    }

    await transporter.sendMail(mail);
}

module.exports = { send };