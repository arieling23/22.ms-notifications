const amqp = require('amqplib');
const { send } = require('../services/notificationService');

async function startConsumer() {
  try {
    const conn = await amqp.connect(process.env.RABBITMQ_URL);
    const channel = await conn.createChannel();

    const exchange = 'events'; // 👈 Mismo que el publisher
    await channel.assertExchange(exchange, 'fanout', { durable: false });

    const queue = 'notifications';
    await channel.assertQueue(queue, { durable: true }); // 👈 durable: true

    await channel.bindQueue(queue, exchange, ''); // fanout no necesita routing key

    console.log('📥 Escuchando eventos en RabbitMQ');

    channel.consume(queue, async (msg) => {
      if (msg) {
        const payload = JSON.parse(msg.content.toString());
        console.log('📨 Recibido evento:', payload);

        const { event, data } = payload;

        // Verificamos si es un evento de recuperación
        if (event === 'password.recovery.requested') {
          const { email, token } = data;

          if (email && token) {
            await send(email, `Tu código de recuperación es: ${token}`, 'RECOVERY');
            console.log(`📧 Correo enviado a ${email}`);
          } else {
            console.warn('⚠️ Evento recibido sin email o token válido');
          }
        }

        channel.ack(msg);
      }
    });
  } catch (err) {
    console.error('❌ Error en consumidor RabbitMQ:', err.message);
  }
}

module.exports = { startConsumer };
