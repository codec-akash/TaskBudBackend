var nodemailer = require('nodemailer');

var transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'akashrdubey19@gmail.com',
        pass: 'Crickash@2000'
    }
});

var mailOptions = {
    from: 'akashrdubey@gmail.com',
    to: 'akashrdubey@yahoo.in',
    subject: 'Test 1',
    text: 'HeloWorld',
};

transporter.sendMail(mailOptions, function (err, info) {
    if (error) {
        console.log(error);
    } else {
        console.log('Email sent: ' + info.response);
    }
});