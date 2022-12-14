const nodemailer = require("nodemailer");

/**
 * sendEmail
 * @param{Object}mailObj - Email information
 */
const sendEmail = async (mailObj) => {
    const{ from, to, subject, text } = mailObj;
    try {
        // Create a transporter
        let transporter = nodemailer.createTransport({
            host: process.env.MAIL_HOST,
            port: process.env.MAIL_PORT | 465,
            auth: {
                user: process.env.MAIL_USER,
                pass: process.env.MAIL_PASS,
            },
        });

        // verify connection configuration
        transporter.verify(function (error) {
            if (error) {
                console.error(error);
            } else {
                console.log('Server is ready to take messages');
            }
        });

        // send mail with defined transport object
        await transporter.sendMail({
            from: from, // sender address
            to: to, // list of receivers
            subject: subject, // subject line
            text: text, // plain text body
        });

    } catch (error) {
        console.error(error);
        throw new Error(
            'Something went wrong in the sendmail method. Error: '+ error.message
        );
    }
};

module.exports = sendEmail;
