require("dotenv").config();

const express = require("express");
const bcrypt = require("bcrypt");
const cors = require("cors");
const jwt = require("jsonwebtoken");
const axios = require("axios");

// ✅ LOWDB v1 (IMPORTANT FIX)
const low = require("lowdb");
const FileSync = require("lowdb/adapters/FileSync");

const adapter = new FileSync("database.json");
const db = low(adapter);

// default structure
db.defaults({ users: [] }).write();

// AI configs
const genAI = require("./config/gemini");
const openai = require("./config/openai");

const AI_PROVIDER = process.env.AI_PROVIDER || "gemini";
const OLLAMA_API_URL = process.env.OLLAMA_API_URL || "http://localhost:11434";
const OLLAMA_MODEL = process.env.OLLAMA_MODEL || "llama3";

const app = express();
const PORT = process.env.PORT || 3000;
const jwtSecretKey = process.env.JWT_SECRET || "secret123";

// ✅ Middleware
app.use(cors());
app.use(express.json());

// ✅ ROOT ROUTE
app.get("/", (req, res) => {
  res.send("Backend is running 🚀");
});


// ================= AUTH =================

// Login / Register
app.post("/auth", async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = db.get("users").find({ email }).value();

    if (user) {
      const valid = await bcrypt.compare(password, user.password);
      if (!valid) return res.status(401).json({ message: "Invalid password" });

      const token = jwt.sign({ email }, jwtSecretKey);
      return res.json({ message: "success", token });
    }

    const hash = await bcrypt.hash(password, 10);

    db.get("users")
      .push({ email, password: hash })
      .write();

    const token = jwt.sign({ email }, jwtSecretKey);
    res.json({ message: "success", token });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Auth error" });
  }
});

// Verify
app.post("/verify", (req, res) => {
  try {
    const token = req.headers["jwt-token"];
    jwt.verify(token, jwtSecretKey);
    res.json({ status: "logged in" });
  } catch {
    res.status(401).json({ status: "invalid auth" });
  }
});


// ================= AI ROUTES =================

// Suggestions
app.post("/ai/suggestions", async (req, res) => {
  const { query } = req.body;

  try {
    if (AI_PROVIDER === "openai") {
      const completion = await openai.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages: [{ role: "user", content: `Suggest 3 trips for ${query}` }],
      });
      return res.json(completion.choices[0].message.content);
    }

    const model = genAI.getGenerativeModel({ model: "gemini-1.5-pro-latest" });
    const result = await model.generateContent(`Suggest trips for ${query}`);

    res.json({ response: result.response.text() });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "AI error" });
  }
});

// Test API
app.get("/ai/test", (req, res) => {
  res.json({ message: "AI route working ✅" });
});


// ================= SERVER =================

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});