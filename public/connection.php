<?php
$servername = "localhost";
$username = "root"; // Default username for XAMPP
$password = "RithikaReddy5$5"; // Default password for XAMPP
$dbname = "responsiveform"; // Your database name

// Create connection
$conn = new mysqli($servername, $username, $password, $dbname);

// Check connection
if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}
?>
