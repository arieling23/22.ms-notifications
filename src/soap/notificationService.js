const { createNotification } = require('../services/notificationService');

const notificationService = {
  NotificationService: {
    NotificationPort: {
      SendNotification(args) {
        const data = {
          email: args.email,
          subject: args.subject,
          message: args.message,
        };
        return createNotification(data).then(() => ({ success: true }));
      }
    }
  }
};

module.exports = notificationService;
