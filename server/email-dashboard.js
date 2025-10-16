// Simple email dashboard that definitely works
const express = require('express');
const { storage } = require('./storage');

const router = express.Router();

router.get('/dashboard', async (req, res) => {
  try {
    const emails = await storage.getCollectedEmails();
    const html = `
<!DOCTYPE html>
<html>
<head>
    <title>Email Dashboard</title>
    <style>
        body { font-family: Arial, sans-serif; margin: 20px; }
        table { border-collapse: collapse; width: 100%; }
        th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
        th { background-color: #f2f2f2; }
        .stats { margin-bottom: 20px; }
        .stat { display: inline-block; margin-right: 20px; padding: 10px; background: #f5f5f5; border-radius: 4px; }
    </style>
</head>
<body>
    <h1>Email Collection Dashboard</h1>
    
    <div class="stats">
        <div class="stat">Total Emails: <strong>${emails.length}</strong></div>
        <div class="stat">Today: <strong>${emails.filter(e => new Date(e.created_at).toDateString() === new Date().toDateString()).length}</strong></div>
    </div>
    
    <h2>Key Emails Status</h2>
    <p>cindytradellc@gmail.com: <strong>${emails.some(e => e.email === 'cindytradellc@gmail.com') ? 'FOUND' : 'NOT FOUND'}</strong></p>
    <p>baltscandlv@gmail.com: <strong>${emails.some(e => e.email === 'baltscandlv@gmail.com') ? 'FOUND' : 'NOT FOUND'}</strong></p>
    
    <h2>All Emails (${emails.length})</h2>
    <table>
        <tr>
            <th>Email</th>
            <th>Date</th>
            <th>Status</th>
            <th>Tier</th>
        </tr>
        ${emails.map(email => `
            <tr>
                <td>${email.email}</td>
                <td>${new Date(email.created_at).toLocaleDateString()}</td>
                <td>${email.is_completed ? 'Complete' : 'Incomplete'}</td>
                <td>${email.premium_tier || 'Free'}</td>
            </tr>
        `).join('')}
    </table>
    
    <p><button onclick="window.location.reload()">Refresh</button></p>
    <p><a href="/">Back to Main Site</a></p>
</body>
</html>`;
    
    res.send(html);
  } catch (error) {
    res.status(500).send('Error: ' + error.message);
  }
});

module.exports = router;