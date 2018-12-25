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
        to: 'amir.m.ebrahimi@controladad.com', // list of receivers
        subject: 'Hello', // Subject line
        text: 'Here are the QR Codes yu have generated', // plain text body
    }
};