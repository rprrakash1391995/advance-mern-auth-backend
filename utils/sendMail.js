const nodemailer = require('nodemailer')

const sendEmail = (options) => {
    const transporter = nodemailer.createTransport({
        service: "SendGrid",
        auth: {
            user: process.env.user,
            pass:process.env.pass
        }
    })

    const mailOptions = {
        from:process.env.from,
        to: options.to,
        subject: options.subject,
        html:options.text
    }
    transporter.sendMail(mailOptions, function (err, info) {
        if (err) {
          console.log(err)
        } else {
            console.log(info)
        }
        
    })
}

module.exports = sendEmail