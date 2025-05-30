require("dotenv").config();

const express = require("express");
const bcrypt = require("bcrypt");
const cors = require('cors');
const jwt = require("jsonwebtoken");
const { join } = require('path');
const { Low } = require('lowdb');
const { JSONFile } = require('lowdb/node');
const genAI = require('./config/gemini');
const openai = require('./config/openai');
const AI_PROVIDER = process.env.AI_PROVIDER || "gemini";
const axios = require('axios');
const OLLAMA_API_URL = process.env.OLLAMA_API_URL || "http://localhost:11434";
const OLLAMA_MODEL = process.env.OLLAMA_MODEL || "llama3";

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

    // AI Suggestions endpoint
    app.post("/ai/suggestions", async (req, res) => {
        const { query } = req.body;
        try {
            if (AI_PROVIDER === "ollama") {
                const prompt = `Suggest 3 tours or activities related to: ${query}. Respond in JSON format as {\"suggestions\":[{\"title\":\"...\",\"description\":\"...\"}]}`;
                const response = await axios.post(`${OLLAMA_API_URL}/api/generate`, {
                    model: OLLAMA_MODEL,
                    prompt: prompt,
                    stream: false
                });
                const text = response.data.response;
                const suggestions = JSON.parse(text).suggestions;
                return res.json(suggestions);
            } else if (AI_PROVIDER === "openai") {
                const completion = await openai.chat.completions.create({
                    model: "gpt-3.5-turbo",
                    messages: [
                        { role: "system", content: "You are a travel assistant that suggests tours and activities. Provide suggestions in JSON format with title and description fields." },
                        { role: "user", content: `Suggest 3 tours or activities related to: ${query}` }
                    ],
                    response_format: { type: "json_object" }
                });
                const suggestions = JSON.parse(completion.choices[0].message.content).suggestions;
                return res.json(suggestions);
            } else {
                const model = genAI.getGenerativeModel({ model: "models/gemini-1.5-pro-latest" });
                const prompt = `Suggest 3 tours or activities related to: ${query}. Respond in JSON format as {\"suggestions\":[{\"title\":\"...\",\"description\":\"...\"}]}`;
                const result = await model.generateContent(prompt);
                const text = result.response.text();
                const suggestions = JSON.parse(text).suggestions;
                return res.json(suggestions);
            }
        } catch (error) {
            console.error('AI suggestions error:', error);
            res.status(500).json({ message: "Error generating suggestions" });
        }
    });

    // AI Recommendations endpoint
    app.post("/ai/recommendations", async (req, res) => {
        const { query, preferences } = req.body;
        try {
            if (AI_PROVIDER === "ollama") {
                const prompt = `Based on these preferences: ${JSON.stringify(preferences)}, suggest personalized travel recommendations for: ${query}. Respond in JSON format as {\"recommendations\":[{\"title\":\"...\",\"description\":\"...\"}]}`;
                const response = await axios.post(`${OLLAMA_API_URL}/api/generate`, {
                    model: OLLAMA_MODEL,
                    prompt: prompt,
                    stream: false
                });
                const text = response.data.response;
                const recommendations = JSON.parse(text).recommendations;
                return res.json(recommendations);
            } else if (AI_PROVIDER === "openai") {
                const completion = await openai.chat.completions.create({
                    model: "gpt-3.5-turbo",
                    messages: [
                        { role: "system", content: "You are a travel assistant that provides personalized travel recommendations. Consider user preferences and provide recommendations in JSON format with title and description fields." },
                        { role: "user", content: `Based on these preferences: ${JSON.stringify(preferences)}, suggest personalized travel recommendations for: ${query}` }
                    ],
                    response_format: { type: "json_object" }
                });
                const recommendations = JSON.parse(completion.choices[0].message.content).recommendations;
                return res.json(recommendations);
            } else {
                const model = genAI.getGenerativeModel({ model: "models/gemini-1.5-pro-latest" });
                const prompt = `Based on these preferences: ${JSON.stringify(preferences)}, suggest personalized travel recommendations for: ${query}. Respond in JSON format as {\"recommendations\":[{\"title\":\"...\",\"description\":\"...\"}]}`;
                const result = await model.generateContent(prompt);
                const text = result.response.text();
                const recommendations = JSON.parse(text).recommendations;
                return res.json(recommendations);
            }
        } catch (error) {
            console.error('AI recommendations error:', error);
            res.status(500).json({ message: "Error generating recommendations" });
        }
    });

    // AI Destinations endpoint
    app.post("/ai/destinations", async (req, res) => {
        const { input } = req.body;
        try {
            if (AI_PROVIDER === "ollama") {
                const prompt = `Suggest 3 destinations related to: ${input}. Respond in JSON format as {\"destinations\":[{\"name\":\"...\",\"type\":\"city|landmark|museum|park|beach|etc\"}]}`;
                const response = await axios.post(`${OLLAMA_API_URL}/api/generate`, {
                    model: OLLAMA_MODEL,
                    prompt: prompt,
                    stream: false
                });
                const text = response.data.response;
                const destinations = JSON.parse(text).destinations;
                return res.json(destinations);
            } else if (AI_PROVIDER === "openai") {
                const completion = await openai.chat.completions.create({
                    model: "gpt-3.5-turbo",
                    messages: [
                        { role: "system", content: "You are a travel assistant that suggests destinations. Provide suggestions in JSON format with name and type fields. Types can be: city, landmark, museum, park, beach, etc." },
                        { role: "user", content: `Suggest 3 destinations related to: ${input}` }
                    ],
                    response_format: { type: "json_object" }
                });
                const destinations = JSON.parse(completion.choices[0].message.content).destinations;
                return res.json(destinations);
            } else {
                const model = genAI.getGenerativeModel({ model: "models/gemini-1.5-pro-latest" });
                const prompt = `Suggest 3 destinations related to: ${input}. Respond in JSON format as {\"destinations\":[{\"name\":\"...\",\"type\":\"city|landmark|museum|park|beach|etc\"}]}`;
                const result = await model.generateContent(prompt);
                const text = result.response.text();
                const destinations = JSON.parse(text).destinations;
                return res.json(destinations);
            }
        } catch (error) {
            console.error('AI destinations error:', error);
            res.status(500).json({ message: "Error generating destination suggestions" });
        }
    });

    // Test AI API endpoint
    app.get("/ai/test", async (req, res) => {
        try {
            if (AI_PROVIDER === "ollama") {
                const prompt = "Say 'API is working correctly' if you can read this message. Respond in JSON format as {\"message\":\"...\"}";
                const response = await axios.post(`${OLLAMA_API_URL}/api/generate`, {
                    model: OLLAMA_MODEL,
                    prompt: prompt,
                    stream: false
                });
                const text = response.data.response;
                const message = JSON.parse(text).message;
                return res.json({
                    status: "success",
                    message: message,
                    apiKeyConfigured: true
                });
            } else if (AI_PROVIDER === "openai") {
                if (!process.env.OPENAI_API_KEY) {
                    return res.status(500).json({ 
                        error: "OpenAI API key is not configured",
                        message: "Please add OPENAI_API_KEY to your .env file"
                    });
                }
                const completion = await openai.chat.completions.create({
                    model: "gpt-3.5-turbo",
                    messages: [
                        { role: "system", content: "You are a helpful assistant." },
                        { role: "user", content: "Say 'API is working correctly' if you can read this message. Respond in JSON format as {\"message\":\"...\"}" }
                    ],
                    response_format: { type: "json_object" }
                });
                const message = JSON.parse(completion.choices[0].message.content).message;
                return res.json({
                    status: "success",
                    message: message,
                    apiKeyConfigured: !!process.env.OPENAI_API_KEY
                });
            } else {
                if (!process.env.GEMINI_API_KEY) {
                    return res.status(500).json({ 
                        error: "Gemini API key is not configured",
                        message: "Please add GEMINI_API_KEY to your .env file"
                    });
                }
                const model = genAI.getGenerativeModel({ model: "models/gemini-1.5-pro-latest" });
                const prompt = "Say 'API is working correctly' if you can read this message. Respond in JSON format as {\"message\":\"...\"}";
                const result = await model.generateContent(prompt);
                const text = result.response.text();
                const message = JSON.parse(text).message;
                return res.json({
                    status: "success",
                    message: message,
                    apiKeyConfigured: !!process.env.GEMINI_API_KEY
                });
            }
        } catch (error) {
            console.error('AI API test error:', error);
            res.status(500).json({
                error: "AI API test failed",
                message: error.message,
                apiKeyConfigured: AI_PROVIDER === "openai" ? !!process.env.OPENAI_API_KEY : (AI_PROVIDER === "ollama" ? true : !!process.env.GEMINI_API_KEY)
            });
        }
    });

    // Start the server
    app.listen(PORT, () => {
        console.log(`Server running on http://localhost:${PORT}`);
    });
}).catch(error => {
    console.error('Failed to start server:', error);
});