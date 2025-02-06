const express = require("express");
const cors = require("cors");
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({ origin: "http://localhost:5173" })); 
app.use(express.json()); 

// Sample API route
app.get("/", (req, res) => {
    res.json({ message: "Backend is running!" });
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`); // Use PORT variable
});

