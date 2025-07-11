const { createNotification, listNotifications } = require('../services/notificationService');

const sendNotification = async (req, res) => {
  try {
    const notif = await createNotification(req.body);
    res.status(201).json(notif);
  } catch (error) {
    res.status(500).json({ message: 'Error al enviar notificación' });
  }
};

const getNotifications = async (req, res) => {
  try {
    const notifs = await listNotifications();
    res.status(200).json(notifs);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener notificaciones' });
  }
};

module.exports = {
  sendNotification,
  getNotifications
};
