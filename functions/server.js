// functions/server.js
// Backend Server for UMYU Scholar AI Assistant (Render-compatible)

require('dotenv').config();

const express = require('express');
const cors = require('cors');
const { GoogleGenAI } = require('@google/genai');
const fs = require('fs');
const path = require('path');

// ============================================================
// 1. INITIALIZE EXPRESS APP
// ============================================================
const app = express();
const PORT = process.env.PORT || 3000;

// CORS — allow requests from your Firebase Hosting site
app.use(cors({
    origin: '*', // Allow all origins (you can restrict this later to your domain)
    methods: ['GET', 'POST', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json({ limit: '10mb' }));

// ============================================================
// 2. INITIALIZE GEMINI API
// ============================================================
const apiKey = process.env.GEMINI_API_KEY;
if (!apiKey) {
    console.error('❌ GEMINI_API_KEY environment variable is not set!');
    process.exit(1); // Stop the server if no key
}
const ai = new GoogleGenAI({ apiKey });
console.log('✅ Gemini API initialized');

// ============================================================
// 3. LOAD KNOWLEDGE BASE
// ============================================================
let KNOWLEDGE_BASE = {};
try {
    const knowledgePath = path.join(__dirname, 'ai', 'knowledge.json');
    const knowledgeData = fs.readFileSync(knowledgePath, 'utf8');
    KNOWLEDGE_BASE = JSON.parse(knowledgeData);
    console.log('✅ Knowledge base loaded successfully!');
    console.log('   Categories:', Object.keys(KNOWLEDGE_BASE).join(', '));
} catch (error) {
    console.error('❌ Error loading knowledge base:', error.message);
    KNOWLEDGE_BASE = { error: 'Knowledge base not found' };
}

// ============================================================
// 4. BUILD SYSTEM PROMPT FROM KNOWLEDGE BASE
// ============================================================
function buildSystemPrompt() {
    const kb = KNOWLEDGE_BASE;

    let prompt = `You are the **UMYU Scholar AI Support Assistant**. Your role is to help users with questions about the UMYU Scholar platform.

## PLATFORM INFORMATION:
- Name: ${kb.platform?.name || 'UMYU Scholar'}
- Description: ${kb.platform?.description || 'A digital repository for UMYU'}
- Creator: ${kb.platform?.creator || 'Ismail Habib Ismail'}
- Purpose: ${kb.platform?.purpose || 'To help the UMYU community share research'}

## PAGES & URLS:
`;
    if (kb.pages) {
        for (const [name, url] of Object.entries(kb.pages)) {
            prompt += `- ${name}: ${url}\n`;
        }
    }

    const categories = ['authentication', 'upload', 'download', 'interactions', 'profile', 'search', 'support', 'legal', 'general'];
    for (const category of categories) {
        if (kb[category]) {
            prompt += `\n## ${category.toUpperCase()}:\n`;
            for (const [key, value] of Object.entries(kb[category])) {
                if (typeof value === 'string') {
                    prompt += `- ${key}: ${value}\n`;
                }
            }
        }
    }

    if (kb.departments) {
        prompt += `\n## DEPARTMENTS:\n${kb.departments.join(', ')}\n`;
    }

    prompt += `

## IMPORTANT INSTRUCTIONS:
1. ALWAYS use the knowledge above to answer questions about UMYU Scholar.
2. For general academic questions (like sampling, research methodology, statistics, etc.), you can answer from your general knowledge.
3. For platform-specific questions (like login, upload, features), ONLY use the knowledge base.
4. If you don't know something about UMYU Scholar, say: "I don't have that information. Please contact support at contact.html or email umyuscholar@gmail.com."
5. Be friendly, helpful, and professional.
6. Keep responses concise but informative.
7. Use numbered lists for steps.
8. Use bold for important terms.
9. Provide links to pages when relevant (e.g., "Go to auth.html").
10. Do NOT ask for personal information like passwords.

## HOW TO ANSWER:
- Platform question → Use knowledge base.
- Academic question → Use your general knowledge.
- If unsure → Say: "I don't have that information. Please contact support."`;

    return prompt;
}

const SYSTEM_PROMPT = buildSystemPrompt();
console.log('✅ System prompt built (' + SYSTEM_PROMPT.length + ' characters)');

// ============================================================
// 5. HEALTH CHECK ENDPOINT
// ============================================================
app.get('/', (req, res) => {
    res.json({
        status: 'ok',
        message: 'UMYU Scholar AI Backend is running!',
        knowledgeLoaded: Object.keys(KNOWLEDGE_BASE).length > 0,
        timestamp: new Date().toISOString()
    });
});

app.get('/health', (req, res) => {
    res.json({
        status: 'ok',
        knowledgeLoaded: Object.keys(KNOWLEDGE_BASE).length > 0
    });
});

// ============================================================
// 6. CHAT ENDPOINT
// ============================================================
app.post('/chat', async (req, res) => {
    try {
        const { message } = req.body;

        if (!message || typeof message !== 'string') {
            return res.status(400).json({ error: 'Message is required' });
        }

        // Clean and sanitize input
        const sanitizedMessage = message.trim().substring(0, 2000);
        console.log(`📩 Question: ${sanitizedMessage.substring(0, 80)}...`);

        // Call Gemini API
        const response = await ai.models.generateContent({
            model: 'gemini-2.0-flash',
            contents: [
                {
                    role: 'user',
                    parts: [{ text: `${SYSTEM_PROMPT}\n\nUser Question: ${sanitizedMessage}` }]
                }
            ],
        });

        const reply = response.text || "I'm sorry, I couldn't process that. Please try again.";
        console.log(`🤖 Reply: ${reply.substring(0, 80)}...`);
        res.json({ reply });

    } catch (error) {
        console.error('❌ Gemini API error:', error.message);
        res.status(500).json({
            error: 'Something went wrong. Please try again later.'
        });
    }
});

// ============================================================
// 7. START SERVER
// ============================================================
app.listen(PORT, '0.0.0.0', () => {
    console.log(`🚀 UMYU Scholar AI Server running on port ${PORT}`);
    console.log(`🌍 Ready to receive requests at http://localhost:${PORT}`);
});