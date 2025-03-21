import React, { useEffect, useState } from 'react';
import axios from 'axios';
import io from 'socket.io-client';
import { Button, Typography } from '@mui/material';

const socket = io('http://localhost:3001');

export default function AgentDashboard({ user }) {
  const [sales, setSales] = useState([]);
  const [notification, setNotification] = useState('');

  useEffect(() => {
    axios.get(`http://localhost:3001/sales/${user.uid}`).then((res) => {
      setSales(res.data);
    });

    socket.on('new-response', (msg) => {
      setNotification(msg);
      if (msg === 'Charged') window.location.href = '/';
    });
  }, []);

  const handleUpload = () => {
    const saleData = [Date.now().toString(), user.uid, 'New Customer', 'Pending'];
    socket.emit('notify-admin', saleData);
    setNotification('Waiting for admin approval...');
  };

  return (
    <div>
      <Typography variant="h4">Your Sales: {sales.length}</Typography>
      <Button variant="contained" onClick={handleUpload}>Upload Sale</Button>
      <Typography>{notification}</Typography>
    </div>
  );
}