require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { initializeApp, cert } = require('firebase-admin/app');
const { getAuth } = require('firebase-admin/auth');
const { getSheetData, appendToSheet } = require('./googleSheets');
const app = express();
const server = require('http').createServer(app);
const io = require('socket.io')(server, { cors: { origin: '*' } });

// Initialize Firebase
initializeApp({
  credential: cert(JSON.parse(process.env.FIREBASE_CREDENTIALS)),
});

app.use(cors());
app.use(express.json());

// Fetch agent-specific sales data
app.get('/sales/:agentId', async (req, res) => {
  try {
    const data = await getSheetData('Sales');
    const agentSales = data.filter(row => row[1] === req.params.agentId);
    res.json(agentSales);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch sales' });
  }
});

// Socket.io for real-time notifications
io.on('connection', (socket) => {
  socket.on('notify-admin', (saleData) => {
    appendToSheet('Sales', saleData).then(() => {
      io.emit('new-sale', saleData[0]); // Emit saleId to admins
    });
  });
});

server.listen(3001, () => console.log('Backend running on port 3001'));