const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema({
  email: String,
  subject: String,
  message: String,
  createdAt: {
    type: Date,
    default: Date.now,
  }
});

module.exports = mongoose.model('Notification', notificationSchema);
