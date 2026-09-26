import express from "express";
import OpenAI from "openai";

const app = express();

app.use(express.json());
app.use(express.static("public"));

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

app.post("/api/chat", async (req, res) => {
  try {
    const userMessage = req.body.message;

    if (!userMessage) {
      return res.status(400).json({
        error: "Keine Nachricht erhalten."
      });
    }

    const response = await client.responses.create({
      model: "gpt-5.6-luna",
      instructions: `
Du bist der digitale Snooker-Assistent von snookertraining.de.

Du hilfst bei:
- Snookertraining
- Technik
- Breakbuilding
- Positionsspiel
- Safety
- Regeln
- Zuschauerfragen

Antworte auf Deutsch, verständlich und praxisnah.

Wenn eine Trainingsfrage unklar ist, stelle gezielte Rückfragen.
Erfinde keine angeblich offiziellen Regeln oder Trainingsmethoden.
Wenn du dir unsicher bist, sage das klar.
      `,
      input: userMessage
    });

    res.json({
      reply: response.output_text
    });

  } catch (error) {
    console.error(error);

    res.status(500).json({
      error: "Beim Snooker Coach ist ein Fehler aufgetreten."
    });
  }
});

const port = process.env.PORT || 3000;

app.listen(port, () => {
  console.log(`Snooker Coach läuft auf Port ${port}`);
});
