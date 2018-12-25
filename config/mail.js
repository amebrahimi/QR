module.exports = {
    mail_config: {
        host: 'smtp.migadu.com',
        port: 587,
        secure: false,
        auth: {
            user: 'admin@mrclover.tk',
            pass: 'samfisher'
        }
    },
    mail_options: {
        from: 'admin@mrclover.tk', // sender address
        to: 'amirebrahimi5@gmail.com', // list of receivers
        subject: 'Hello', // Subject line
        text: 'Hello world', // plain text body
    }
};