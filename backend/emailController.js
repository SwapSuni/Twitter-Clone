import handler from 'express-async-handler'
import nodemailer from 'nodemailer'
import dotenv from 'dotenv';
dotenv.config();

let transporter = nodemailer.createTransport({
    service: "gmail",
    host: process.env.SMTP_HOST,
    port: process.env.SMTP_PORT,
    secure: true, // true for 465, false for other ports
    auth: {
        user: process.env.SMTP_MAIL, // generated ethereal user
        pass: process.env.SMTP_PASSWORD, // generated ethereal password
    },
    tls: {
        rejectUnauthorized: true,
    },
});

export const sendEmail = handler(async (req, res) => {
    const { email, message } = req.body;
    console.log(email, message);

    var mailOptions = {
      from: process.env.SMTP_MAIL,
      to: email,
      text: message,
    };

    transporter.sendMail(mailOptions, function (error, info) {
      if (error) {
        console.log(error);
      } else {
        res.json({msg: "sent"});
        console.log("Email sent successfully!");
      }
    });
  });

