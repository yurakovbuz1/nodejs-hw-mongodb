import { SMTP } from '../constants/constants.js';
import nodemailer from 'nodemailer';

const transport = nodemailer.createTransport({
  host: SMTP.HOST,
  port: SMTP.PORT,
  secure: false,
  auth: {
    user: SMTP.USER,
    pass: SMTP.PASSWORD,
  },
});

export function sendMail(message) {
  return transport.sendMail(message);
}
