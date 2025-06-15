const express = require('express');
const app = express();
const path = require('path');
const pool = require('./db');
const nodemailer = require('nodemailer');
require('dotenv').config();

// Middleware
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// Setup transporter using environment variables
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

app.post('/api/submit', async (req, res) => {
  const { name, email, phone, from, to, type, message } = req.body;

  console.log("📝 Received form data:", req.body); // Debug log

  try {
    const sql = `
      INSERT INTO orders (customer_name, email, mobile_number, ship_from, ship_to, consignment_type, message)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `;
    await pool.execute(sql, [name, email, phone, from, to, type, message]);

    // Send confirmation email
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: 'QuickShip: Shipment Confirmation',
      html: `
        <h3>Dear ${name},</h3>
        <p>Your shipment request has been received and logged successfully.</p>
        <p><strong>From:</strong> ${from}<br/>
        <strong>To:</strong> ${to}<br/>
        <strong>Type:</strong> ${type}<br/>
        <strong>Message:</strong> ${message}</p>
        <p>We’ll process your shipment shortly. Thank you for using QuickShip!</p>
      `
    };

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.error('❌ Email failed:', error.message);
      } else {
        console.log('📧 Email sent:', info.response);
      }
    });

    res.json({ success: true });

  } catch (err) {
    console.error("❌ Failed to save shipment:", err);
    res.status(500).json({ success: false, message: "Database error" });
  }
});

// Serve index.html
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});

