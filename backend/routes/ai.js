import dotenv from "dotenv";
dotenv.config();

import express from "express";
import Groq from "groq-sdk";

const router = express.Router();

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY
});

router.post("/generate-itinerary", async (req, res) => {
  const { destination, numDays } = req.body;

  const prompt = `
Create a ${numDays}-day travel itinerary for ${destination.name}, ${destination.country}.

Destination details:
Description: ${destination.description}
Top attraction: ${destination.top_attraction}
Category: ${destination.category}
Best season: ${destination.best_season}

Budget: about £${destination.daily_cost}/day.

Return JSON in this format:

{
  "days": [
    {
      "label": "Day 1",
      "activities": [
        {"time":"09:00","text":"Visit attraction"}
      ]
    }
  ]
}
`;

  try {
    const response = await groq.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      messages: [
        { role: "user", content: prompt }
      ],
      temperature: 0.7
    });

    const content = response.choices[0].message.content;

    const jsonMatch = content.match(/\{[\s\S]*\}/);
const data = JSON.parse(jsonMatch[0]);

    res.json(data);

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "AI generation failed" });
  }
});

export default router;