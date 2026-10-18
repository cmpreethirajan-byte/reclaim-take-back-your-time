import 'dotenv/config';
import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { GoogleGenAI, Type } from '@google/genai';
import { createServer as createViteServer } from 'vite';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const BUILTIN_FALLBACK_ACTIVITIES = [
  {
    activity: 'Step Outside & Skywatch',
    duration_minutes: 5,
    why: 'Looking toward the far horizon relaxes eye strain and grounds your attention in the natural world.'
  },
  {
    activity: 'Mindful Glass of Cool Water',
    duration_minutes: 3,
    why: 'Drinking water slowly without a screen resets your physical senses and interrupts the scrolling loop.'
  },
  {
    activity: '4-7-8 Calm Breath Reset',
    duration_minutes: 5,
    why: 'Inhaling for 4 seconds, holding for 7, and exhaling for 8 calms an overstimulated nervous system.'
  },
  {
    activity: 'Gentle Neck & Shoulder Release',
    duration_minutes: 5,
    why: 'Rolling your shoulders and stretching your neck relieves tension built up from looking down at a phone.'
  },
  {
    activity: 'Write Three Gratitudes on Paper',
    duration_minutes: 5,
    why: 'Using pen and paper reconnects you to tactile reality and shifts focus toward what feels meaningful.'
  },
  {
    activity: 'Water a Plant or Touch Nature',
    duration_minutes: 5,
    why: 'Caring for living greenery or stepping onto a balcony lowers stress and restores calm.'
  },
  {
    activity: 'Five-Minute Desk or Room Reset',
    duration_minutes: 5,
    why: 'Tidying one small surface gives your brain a clear, tangible sense of completion offline.'
  },
  {
    activity: 'Empty-Handed Short Walk',
    duration_minutes: 10,
    why: 'Walking for ten minutes without holding a device clears mental fog and restores natural curiosity.'
  },
  {
    activity: 'Listen to One Song with Eyes Closed',
    duration_minutes: 4,
    why: 'Resting your eyes while focusing purely on sound gives your visual cortex a restorative break.'
  },
  {
    activity: 'Check In with Someone at Home',
    duration_minutes: 10,
    why: 'A brief face-to-face conversation builds real warmth that endless feeds cannot replace.'
  }
];

function getGeminiClient(): GoogleGenAI | null {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey || apiKey === 'MY_GEMINI_API_KEY' || apiKey === 'YOUR_GEMINI_API_KEY') {
    return null;
  }
  return new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });
}

async function startServer() {
  const app = express();
  const PORT = Number(process.env.PORT) || 3000;

  app.use(express.json({ limit: '1mb' }));

  app.get('/api/health', (_req, res) => {
    res.json({ status: 'ok', app: 'RECLAIM: Take Back Your Time' });
  });

  // 1. Pause and Reflect Endpoint
  app.post('/api/reflect', async (req, res) => {
    const {
      mood = 'Just habit',
      timeOfDay = 'daytime',
      goalMinutes = 60,
      loggedMinutes = 0,
      language = 'English',
    } = req.body || {};

    const fallbackReflection =
      language === 'English'
        ? `It is completely human to reach for your phone when feeling ${String(mood).toLowerCase()} in the ${timeOfDay}. You have logged ${loggedMinutes} of your ${goalMinutes}-minute goal today—pausing right now is already a gentle victory.`
        : `Pausing when you feel ${String(mood).toLowerCase()} is a kind step toward taking back your time. You have used ${loggedMinutes} of ${goalMinutes} minutes today—take a slow breath and choose what truly supports you next.`;

    try {
      const ai = getGeminiClient();
      if (!ai) {
        return res.json({ reflection: fallbackReflection, isFallback: true });
      }

      const percentUsed = goalMinutes > 0 ? Math.round((loggedMinutes / goalMinutes) * 100) : 0;
      const prompt = `You are a warm, non-judgmental digital wellbeing companion in the app "RECLAIM: Take Back Your Time".
A user just tapped "Pause and Reflect" to interrupt mindless scrolling.
Context:
- Current feeling/mood: ${mood}
- Time of day: ${timeOfDay}
- Daily scrolling goal: ${goalMinutes} minutes
- Self-reported scrolling time used today: ${loggedMinutes} minutes (${percentUsed}% of daily goal)
- Response language: ${language}

Write ONE short, kind, comforting reflection (25 to 45 words) in ${language}.
Acknowledge their mood gently, mention their time of day or progress without guilt or scolding, and encourage a calm, conscious choice. Return plain text only.`;

      const response = await ai.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: prompt,
      });

      const text = response.text?.trim();
      if (!text) {
        return res.json({ reflection: fallbackReflection, isFallback: true });
      }

      return res.json({ reflection: text, isFallback: false });
    } catch (error) {
      console.error('Gemini /api/reflect error:', error);
      return res.json({ reflection: fallbackReflection, isFallback: true });
    }
  });

  // 2. AI Activity Coach Endpoint
  app.post('/api/activity-coach', async (req, res) => {
    const {
      goalMinutes = 60,
      loggedMinutes = 0,
      availableMinutes = 10,
      language = 'English',
      previousActivity = '',
    } = req.body || {};

    const pickFallback = () => {
      const candidates = BUILTIN_FALLBACK_ACTIVITIES.filter(
        (item) => item.activity !== previousActivity
      );
      const pool = candidates.length > 0 ? candidates : BUILTIN_FALLBACK_ACTIVITIES;
      const chosen = pool[Math.floor(Math.random() * pool.length)];
      return {
        ...chosen,
        isFallback: true,
        fallbackMessage:
          'Showing a suggestion from our built-in restorative activity list while AI coaching is offline.',
      };
    };

    try {
      const ai = getGeminiClient();
      if (!ai) {
        return res.json(pickFallback());
      }

      const remainingMinutes = Math.max(0, goalMinutes - loggedMinutes);
      const prompt = `Suggest ONE simple, offline, screen-free activity to help someone take a healthy break from phone scrolling.
Context:
- User's daily scrolling goal: ${goalMinutes} minutes
- Scrolling time logged today: ${loggedMinutes} minutes (${remainingMinutes} minutes remaining in goal)
- Available time for break: around ${availableMinutes} minutes
- Avoid repeating this activity: "${previousActivity}"
- Respond in language: ${language}

Provide a practical, sustainable, calming real-world activity that requires zero special equipment.`;

      const response = await ai.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: prompt,
        config: {
          responseMimeType: 'application/json',
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              activity: {
                type: Type.STRING,
                description: 'Short, inviting name of the offline activity in the requested language.',
              },
              duration_minutes: {
                type: Type.INTEGER,
                description: 'Suggested duration in minutes (between 3 and 20).',
              },
              why: {
                type: Type.STRING,
                description: 'One kind, clear sentence explaining why this helps restore attention and wellbeing.',
              },
            },
            required: ['activity', 'duration_minutes', 'why'],
          },
        },
      });

      const rawText = response.text?.trim();
      if (!rawText) {
        return res.json(pickFallback());
      }

      const parsed = JSON.parse(rawText);
      if (!parsed || !parsed.activity || !parsed.why) {
        return res.json(pickFallback());
      }

      return res.json({
        activity: String(parsed.activity),
        duration_minutes: Number(parsed.duration_minutes) || 5,
        why: String(parsed.why),
        isFallback: false,
      });
    } catch (error) {
      console.error('Gemini /api/activity-coach error:', error);
      return res.json(pickFallback());
    }
  });

  // 3. Dynamic & UI Translation Endpoint
  app.post('/api/translate', async (req, res) => {
    const { text, texts, targetLang } = req.body || {};

    if (!targetLang || targetLang === 'English') {
      return res.json({ translatedText: text || '', translatedTexts: texts || {} });
    }

    try {
      const ai = getGeminiClient();
      if (!ai) {
        return res.json({
          translatedText: text || '',
          translatedTexts: texts || {},
          isFallback: true,
        });
      }

      // Batch dictionary translation for non-built-in languages
      if (texts && typeof texts === 'object') {
        const prompt = `Translate the values of this JSON object from English into ${targetLang} for a calm, family-friendly digital wellbeing app called "RECLAIM: Take Back Your Time".
Keep the exact same JSON keys. Keep translations concise, natural, and easy to read on a mobile screen. Do not translate the brand name "RECLAIM" or "Google Family Link" or "Gemini".
Input JSON:
${JSON.stringify(texts)}`;

        const response = await ai.models.generateContent({
          model: 'gemini-3.8-flash',
          contents: prompt,
          config: {
            responseMimeType: 'application/json',
          },
        });

        const raw = response.text?.trim();
        if (raw) {
          const parsed = JSON.parse(raw);
          return res.json({ translatedTexts: parsed, isFallback: false });
        }
        return res.json({ translatedTexts: texts, isFallback: true });
      }

      // Single text translation
      if (text) {
        const prompt = `Translate the following text into ${targetLang} with a warm, calm, supportive tone. Return ONLY the translated text without quotes:
${text}`;

        const response = await ai.models.generateContent({
          model: 'gemini-3.8-flash',
          contents: prompt,
        });

        const translatedText = response.text?.trim() || text;
        return res.json({ translatedText, isFallback: false });
      }

      return res.json({ translatedText: '', translatedTexts: {} });
    } catch (error) {
      console.error('Gemini /api/translate error:', error);
      return res.json({
        translatedText: text || '',
        translatedTexts: texts || {},
        isFallback: true,
      });
    }
  });

  // Serve frontend via Vite in development, or static dist in production
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(__dirname, 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`RECLAIM server listening on http://0.0.0.0:${PORT}`);
  });
}

startServer();
