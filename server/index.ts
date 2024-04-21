import express, { Request, Response } from "express";
import fetch from "node-fetch";
import bodyParser from "body-parser";
import "dotenv/config";
import OpenAI from "openai";
import cors from "cors";

const app = express();
const port = 8080;

app.use(cors());

app.use(bodyParser.json());

app.get("/", (req: Request, res: Response) => {
  res.send("Hello World!");
});

interface FlashcardNote {
  deckName: string;
  modelName: string;
  fields: {
    Front: string;
    Back: string;
  };
  tags: string[];
}

interface Flashcard {
  Front: string;
  Back: string;
}

app.post("/remember", async (req: Request, res: Response) => {
  const { text }: { text?: string } = req.body;

  if (!text) {
    return res.status(400).send("No text provided.");
  }

  try {
    const flashcard: Flashcard = await extractFlashcard(text);

    await invoke("addNote", 6, {
      note: {
        deckName: process.env.ANKI_DECK_NAME || "Default",
        modelName: "Basic",
        fields: {
          Front: flashcard.Front,
          Back: flashcard.Back,
        },
        tags: ["generated"],
      },
    });

    res.send(`Added flashcard to the deck.`);
  } catch (err) {
    console.error(err);
    res.status(500).send("An error occurred while processing your request.");
  }
});

async function extractFlashcard(text: string): Promise<Flashcard> {
  const openai = new OpenAI();
  const instruction =
    "Please provide a question for the front of a flashcard and an answer for the back based on the provided text. The question should be one sentence, and the answer should be another sentence, directly following the question.";
  const response = await openai.chat.completions.create({
    model: "gpt-4-turbo",
    messages: [
      {
        role: "system",
        content: instruction,
      },
      {
        role: "user",
        content: text,
      },
    ],
    temperature: 0.6,
    max_tokens: 256,
    top_p: 1,
    frequency_penalty: 0,
    presence_penalty: 0,
  });

  if (!response.choices || response.choices.length === 0) {
    console.error("Unexpected response structure:", response);
    throw new Error("Invalid response structure from OpenAI API");
  }

  const fullResponse = response.choices[0].message?.content;
  if (!fullResponse) {
    throw new Error("No valid response for flashcard extraction.");
  }

  const sentences = fullResponse.match(/[^.!\?]+[.!\?]+/g) || [];
  if (sentences.length < 2) {
    throw new Error(
      "The response did not contain enough information for a flashcard.",
    );
  }

  const newSentences = sentences.map((sentence) => sentence.trim()).slice(0, 2);

  return {
    Front: newSentences[0],
    Back: newSentences[1],
  };
}

async function invoke(
  action: string,
  version: number,
  params: { note: FlashcardNote },
) {
  const response = await fetch("http://127.0.0.1:8765", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ action, version, params }),
  });

  const data = (await response.json()) as { error?: string; result?: unknown };

  if (data.error) {
    throw new Error(data.error);
  }

  return data.result;
}

app.listen(port, () => {
  console.log(`Listening on port ${port}...`);
});

export default app;
