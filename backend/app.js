const express = require("express");
const bcrypt = require("bcrypt");
const cors = require('cors');
const jwt = require("jsonwebtoken");
const { join } = require('path');
const { Low } = require('lowdb');
const { JSONFile } = require('lowdb/node');
require("dotenv").config();

// Initialize Express app
const app = express();

// Define PORT from environment variables or default to 3000
const PORT = process.env.PORT || 3000;

// Define a JWT secret key. This should be isolated by using env variables for security
const jwtSecretKey = "dsfdsfsdfdsvcsvdfgefg";

// Configure lowdb with default data
const dbFile = join(__dirname, 'database.json');
const adapter = new JSONFile(dbFile);
// Create default data
const defaultData = { users: [] };
const db = new Low(adapter, defaultData);  // Pass defaultData as second argument

// Initialize database
async function initializeDb() {
    try {
        await db.read();
        // Only write if the file doesn't exist
        if (db.data === null) {
            db.data = defaultData;
            await db.write();
        }
    } catch (error) {
        console.error('Database initialization error:', error);
        // Ensure db.data exists even if read fails
        db.data = defaultData;
    }
}

// Initialize database before starting server
initializeDb().then(() => {
    // Set up CORS and JSON middlewares
    app.use(cors());
    app.use(express.json());

    // Sample API route
    app.get("/", (req, res) => {
        res.json({ message: "Backend is running!" });
    });

    // The auth endpoint that creates a new user record or logs a user based on an existing record
    app.post("/auth", async (req, res) => {
        const { email, password } = req.body;
        
        try {
            await db.read();
            
            // Look up the user entry in the database
            const user = db.data.users.filter(user => email === user.email);

            // If found, compare the hashed passwords and generate the JWT token for the user
            if (user.length === 1) {
                bcrypt.compare(password, user[0].password, function (_err, result) {
                    if (!result) {
                        return res.status(401).json({ message: "Invalid password" });
                    } else {
                        let loginData = {
                            email,
                            signInTime: Date.now(),
                        };

                        const token = jwt.sign(loginData, jwtSecretKey);
                        res.status(200).json({ message: "success", token });
                    }
                });
            // If no user is found, hash the given password and create a new entry in the auth db
            } else if (user.length === 0) {
                bcrypt.hash(password, 10, async function (_err, hash) {
                    console.log({ email, password: hash });
                    db.data.users.push({ email, password: hash });
                    await db.write();

                    let loginData = {
                        email,
                        signInTime: Date.now(),
                    };

                    const token = jwt.sign(loginData, jwtSecretKey);
                    res.status(200).json({ message: "success", token });
                });
            }
        } catch (error) {
            console.error('Auth error:', error);
            res.status(500).json({ message: "Internal server error" });
        }
    });

    // The verify endpoint that checks if a given JWT token is valid
    app.post('/verify', (req, res) => {
        const tokenHeaderKey = "jwt-token";
        const authToken = req.headers[tokenHeaderKey];
        try {
            const verified = jwt.verify(authToken, jwtSecretKey);
            if (verified) {
                return res
                    .status(200)
                    .json({ status: "logged in", message: "success" });
            } else {
                // Access Denied
                return res.status(401).json({ status: "invalid auth", message: "error" });
            }
        } catch (error) {
            // Access Denied
            return res.status(401).json({ status: "invalid auth", message: "error" });
        }
    });

    // An endpoint to see if there's an existing account for a given email address
    app.post('/check-account', async (req, res) => {
        const { email } = req.body;
        
        try {
            await db.read();
            
            console.log(req.body);

            const user = db.data.users.filter(user => email === user.email);

            console.log(user);
            
            res.status(200).json({
                status: user.length === 1 ? "User exists" : "User does not exist",
                userExists: user.length === 1
            });
        } catch (error) {
            console.error('Check account error:', error);
            res.status(500).json({ message: "Internal server error" });
        }
    });

    // Start the server
    app.listen(PORT, () => {
        console.log(`Server running on http://localhost:${PORT}`);
    });
}).catch(error => {
    console.error('Failed to start server:', error);
});