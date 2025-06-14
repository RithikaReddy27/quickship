const express = require('express');
const router = express.Router();
const pool = require('../db'); // adjust the path if needed

router.post('/submit-form', async (req, res) => {
  try {
    const {
      name,
      email,
      phone,
      ship_from,
      ship_to,
      consignment_type,
      message
    } = req.body;

    // Execute insert with correct DB column names
    const [result] = await pool.execute(
      `INSERT INTO orders (
        customer_name, email, mobile_number,
        ship_from, ship_to, consignment_type, message
      ) VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [name, email, phone, ship_from, ship_to, consignment_type, message]
    );

    res.status(200).json({
      success: true,
      message: 'Shipment request submitted successfully!',
      orderId: result.insertId
    });
  } catch (err) {
    console.error('❌ Error in /submit-form:', err);
    res.status(500).json({ success: false, message: 'Internal Server Error' });
  }
});

module.exports = router;
