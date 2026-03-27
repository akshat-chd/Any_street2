/* eslint-env node */

import 'dotenv/config';
import cors from 'cors';
import express from 'express';
import { GoogleGenAI } from '@google/genai';

const app = express();
const port = Number(process.env.PORT || 8787);
const host = process.env.HOST || '127.0.0.1';
const client = process.env.GEMINI_API_KEY
  ? new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY })
  : null;

const allowedOrigins = process.env.CORS_ORIGIN
  ? process.env.CORS_ORIGIN.split(',').map((origin) => origin.trim())
  : true;

const responseSchema = {
  type: 'object',
  properties: {
    answer: { type: 'string' },
    safetyNote: { type: 'string' },
    suggestions: {
      type: 'array',
      items: { type: 'string' },
    },
    nextActions: {
      type: 'array',
      items: { type: 'string' },
    },
    recommendedPetKeys: {
      type: 'array',
      items: { type: 'string' },
    },
  },
  required: [
    'answer',
    'safetyNote',
    'suggestions',
    'nextActions',
    'recommendedPetKeys',
  ],
  additionalProperties: false,
};

app.use(
  cors({
    origin: allowedOrigins,
  })
);
app.use(express.json({ limit: '1mb' }));

app.get('/api/health', (_request, response) => {
  response.json({
    ok: true,
    configured: Boolean(client),
    model: process.env.GEMINI_MODEL || 'gemini-2.5-flash',
  });
});

app.post('/api/ai/assistant', async (request, response) => {
  if (!client) {
    response.status(503).json({
      error:
        'The AI server is missing GEMINI_API_KEY. Add it to server/.env before using the assistant.',
    });
    return;
  }

  const {
    message = '',
    page = '/',
    profile = {},
    pets = [],
    conversation = [],
  } = request.body || {};

  if (!message.trim()) {
    response.status(400).json({ error: 'A message is required.' });
    return;
  }

  const compactPets = Array.isArray(pets)
    ? pets.slice(0, 10).map((pet) => ({
        petKey: pet.petKey,
        name: pet.name,
        animal: pet.animal,
        age: pet.age,
        location: pet.location,
        details: pet.details,
        status: pet.status,
      }))
    : [];

  const compactConversation = Array.isArray(conversation)
    ? conversation.slice(-6).map((item) => ({
        role: item.role,
        text: item.text,
      }))
    : [];

  const systemPrompt = `
You are AnyStreet AI, a concise and practical assistant for animal adoption, pet care guidance, stray reporting, and local next steps.

Rules:
- Be helpful, warm, and concrete.
- If the situation sounds urgent, tell the user to contact a local veterinarian, shelter, or emergency service immediately.
- Do not claim to diagnose medical conditions.
- If pets are provided, only recommend pets from the provided list and return their exact petKey values.
- If no pets are provided, leave recommendedPetKeys empty.
- Keep answers short enough for an app UI.
- nextActions must be concrete, immediately usable steps.
- suggestions should be short follow-up prompts the user can tap.
`.trim();

  const userContext = {
    page,
    message,
    profile,
    conversation: compactConversation,
    pets: compactPets,
  };

  try {
    const aiResponse = await client.models.generateContent({
      model: process.env.GEMINI_MODEL || 'gemini-2.5-flash',
      contents: [
        {
          role: 'user',
          parts: [
            {
              text: `${systemPrompt}\n\nReturn valid JSON only.`,
            },
            {
              text: JSON.stringify(userContext),
            },
          ],
        },
      ],
      config: {
        responseMimeType: 'application/json',
        responseJsonSchema: responseSchema,
        maxOutputTokens: 700,
      },
    });

    const parsed = JSON.parse(aiResponse.text || '{}');
    response.json(parsed);
  } catch (error) {
    response.status(500).json({
      error: error?.message || 'The AI assistant could not generate a reply.',
    });
  }
});

app.listen(port, host, () => {
  console.log(`AnyStreet AI server listening on http://${host}:${port}`);
});
