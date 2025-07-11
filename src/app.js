require('dotenv').config();
const express = require('express');
const connectDB = require('./config/db');
const corsOptions = require('./middlewares/corsOptions');
const verifyJWT = require('./middlewares/verifyJWT');
const { sendNotification, getNotifications } = require('./controllers/notificationController');

const soap = require('strong-soap').soap;
const fs = require('fs');
const path = require('path');
const http = require('http');
const notificationService = require('./soap/notificationService');
const { startConsumer } = require('./events/consumer'); 

// ✅ Leer archivo WSDL con ruta absoluta segura
const wsdl = fs.readFileSync(path.join(__dirname, 'soap', 'notificationService.wsdl'), 'utf8');

const app = express();
app.use(corsOptions);
app.use(express.json());

app.post('/api/notify', verifyJWT, sendNotification);
app.get('/api/notifications', verifyJWT, getNotifications);

connectDB();

// SOAP Server
const server = http.createServer(app);
server.listen(4000, () => {
  soap.listen(server, '/wsdl', notificationService, wsdl);
  console.log('📡 SOAP listo en http://34.231.222.249:4000/wsdl');

  // ✅ Iniciar consumidor de eventos cuando el servidor esté listo
  startConsumer();
});
