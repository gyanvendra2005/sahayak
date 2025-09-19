import cron from 'node-cron';
import fetch from 'node-fetch';

cron.schedule('*/30 * * * * *', async () => {
  console.log('Calling local API at', new Date().toLocaleTimeString());
  const res = await fetch('http://localhost:3000/api/run-task', { method: 'POST' });
  const data = await res.json();
  console.log('Response from API:', data);
});

console.log('Cron job started...');

