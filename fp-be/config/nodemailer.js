import nodemailer from "nodemailer";

export const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 465,
  secure: true,
  auth: {
    user: 'jahangeer9182@gmail.com',
    pass: 'xbpi qhpw fbon awhn',
  },
});