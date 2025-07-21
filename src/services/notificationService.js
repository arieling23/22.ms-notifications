const Notification = require('../models/Notification');
const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: parseInt(process.env.EMAIL_PORT),
  secure: false,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

async function send(email, message, subject) {
  try {
    
    await transporter.sendMail({
      from: `"Soporte" <${process.env.EMAIL_USER}>`,
      to: email,
      subject,
      text: message,
    });

    
    const notif = new Notification({ email, subject, message });
    await notif.save();

    console.log(`📧 Correo enviado a ${email}`);
    return notif;
  } catch (error) {
    console.error('❌ Error al enviar correo:', error.message);
    throw error;
  }
}

async function createNotification(data) {
  const notif = new Notification(data);
  return await notif.save();
}

async function listNotifications() {
  return await Notification.find().sort({ createdAt: -1 });
}

module.exports = {
  send,
  createNotification,
  listNotifications
};
