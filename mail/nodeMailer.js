module.exports = (mailOptions, nodemailer, mailConfig) => {

    const transporter = nodemailer.createTransport(mailConfig);

    transporter.sendMail(mailOptions, (err, info) => {
        if (err) {
            return console.log(err);
        }

        console.log(`Message sent: ${info.messageId}`);
        console.log(`Preview URL : ${nodemailer.getTestMessageUrl(info)}`);
    });
};