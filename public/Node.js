const express = require('express');
const mysql = require('mysql2');
const bodyParser = require('body-parser');
const path = require('path');

const app = express();
const port = 3001;

// Middleware to parse JSON bodies
app.use(bodyParser.json());

// Serve static files
app.use(express.static(path.join(__dirname, 'public')));

// MySQL Database Connection
const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'your_password',
    database: 'quickship_db'
});

// Connect to MySQL
connection.connect((err) => {
    if (err) {
        console.error('Error connecting to MySQL:', err.stack);
        return;
    }
    console.log('Connected to MySQL as id', connection.threadId);
});

// Route to handle form submission
app.post('/submit-form', (req, res) => {
    const { name, email, phone, ship_from, ship_to, consignment_type, message } = req.body;

    const insertQuery = 'INSERT INTO order_details (customer_name, email, phone, ship_from, ship_to, consignment_type, message) VALUES (?, ?, ?, ?, ?, ?, ?)';
    connection.query(insertQuery, [name, email, phone, ship_from, ship_to, consignment_type, message], (err, results) => {
        if (err) {
            console.error('Error inserting into database:', err.stack);
            res.status(500).send('Error inserting into database');
            return;
        }
        console.log('Inserted:', results);
        // Redirect to the new page after successful submission
        res.redirect('/myaccount');
    });
});

// Serve myaccount.html on '/myaccount' route
app.get('/myaccount', (req, res) => {
    // Render the myaccount.html page
    res.sendFile(path.join(__dirname, 'public', 'myaccount.html'));
});

// Start the server
app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
