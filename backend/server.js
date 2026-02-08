import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import Groq from "groq-sdk";
import fs from "fs";
import { retrieveContext } from "./rag.js";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY
});

// Load classes
const classes = JSON.parse(
  fs.readFileSync("./data/classes.json", "utf8")
);

// Chat endpoint
app.post("/chat", async (req, res) => {
  try {
    const userMsg = req.body.message.toLowerCase();
    const context = retrieveContext(userMsg);

    // Booking logic
    for (let cls of classes) {
      if (userMsg.includes("book") && userMsg.includes(cls.name.toLowerCase())) {
        return res.json({
          reply: `✅ You are successfully booked for ${cls.name} with ${cls.trainer} at ${cls.time}.`
        });
      }
    }

    // List classes
    if (userMsg.includes("class")) {
      const list = classes
        .map(c => `${c.name} with ${c.trainer} at ${c.time}`)
        .join("\n");

      return res.json({
        reply: `Available classes:\n${list}`
      });
    }

    // AI response
    const completion = await groq.chat.completions.create({
      model: "llama-3.1-8b-instant",
      messages: [
        {
          role: "system",
          content: `You are a fitness assistant. Use this knowledge:\n${context}`
        },
        {
          role: "user",
          content: userMsg
        }
      ]
    });

    res.json({
      reply: completion.choices[0].message.content
    });

  } catch (error) {
    console.error("AI ERROR:", error);
    res.status(500).json({
      reply: "AI service error."
    });
  }
});

app.listen(5000, () => {
  console.log("Server running on http://localhost:5000");
});
