const express = require('express')
const bcrypt = require('bcrypt')
const cors = require('cors')
const jwt = require('jsonwebtoken')
const path = require('path')
const fs = require('fs')

// Initialize Express app
const app = express()
const port = 3080

// Use JSON file for storage
const file = path.join(__dirname, "database.json")

// Initialize database
let db = { users: [] }
try {
    const data = fs.readFileSync(file, 'utf8')
    db = JSON.parse(data)
} catch (err) {
    fs.writeFileSync(file, JSON.stringify(db, null, 2))
}

// Helper function to save database
function saveDB() {
    fs.writeFileSync(file, JSON.stringify(db, null, 2))
}

// Define a JWT secret key. This should be isolated by using env variables for security
const jwtSecretKey = "your-secret-key"

// Set up CORS and JSON middlewares
app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

// Basic home route for the API
app.get("/", (_req, res) => {
    res.send("Auth API.\nPlease use POST /auth & POST /verify for authentication")
})

// The auth endpoint that creates a new user record or logs a user based on an existing record
app.post("/auth", async (req, res) => {
    const { email, password } = req.body

    // Look up the user entry in the database
    const user = db.users.filter(u => u.email === email)

    // If found, compare the hashed passwords and generate the JWT token for the user
    if (user.length === 1) {
        bcrypt.compare(password, user[0].password, function (_err, result) {
            if (!result) {
                return res.status(401).json({ message: "Invalid password" })
            } else {
                let loginData = {
                    email,
                    signInTime: Date.now(),
                }

                const token = jwt.sign(loginData, jwtSecretKey)
                res.status(200).json({ message: "success", token })
            }
        })
    // If no user is found, hash the given password and create a new entry in the auth db
    } else if (user.length === 0) {
        bcrypt.hash(password, 10, function (_err, hash) {
            db.users.push({ email, password: hash })
            saveDB()

            let loginData = {
                email,
                signInTime: Date.now(),
            }

            const token = jwt.sign(loginData, jwtSecretKey)
            res.status(200).json({ message: "success", token })
        })
    }
})

// The verify endpoint that checks if a given JWT token is valid
app.post('/verify', (req, res) => {
    const tokenHeaderKey = "jwt-token"
    const authToken = req.headers[tokenHeaderKey]
    try {
        const verified = jwt.verify(authToken, jwtSecretKey)
        if (verified) {
            return res.status(200).json({ status: "logged in", message: "success" })
        } else {
            // Access Denied
            return res.status(401).json({ status: "invalid auth", message: "error" })
        }
    } catch (error) {
        // Access Denied
        return res.status(401).json({ status: "invalid auth", message: "error" })
    }
})

// An endpoint to see if there's an existing account for a given email address
app.post('/check-account', (req, res) => {
    const { email } = req.body
    const user = db.users.filter(u => u.email === email)
    
    res.status(200).json({
        status: user.length === 1 ? "User exists" : "User does not exist", userExists: user.length === 1
    })
})

app.listen(port, () => {
    console.log(`Auth server running at http://localhost:${port}`)
})