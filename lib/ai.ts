export async function generateLearningMaterials(text: string, actions: string[]) {
  const geminiKey = process.env.GEMINI_API_KEY || process.env.NEXT_PUBLIC_GEMINI_API_KEY;
  const openrouterKey = process.env.OPENROUTER_API_KEY || process.env.NEXT_PUBLIC_OPENROUTER_API_KEY;
  const groqKey = process.env.GROQ_API_KEY || process.env.NEXT_PUBLIC_GROQ_API_KEY;

  if (!geminiKey && !openrouterKey && !groqKey) {
    throw new Error("No LLM API keys found. Please define GEMINI_API_KEY, OPENROUTER_API_KEY, or GROQ_API_KEY in your env file.");
  }

  const systemPrompt = `You are StudyMate AI, an elite educational assistant. Your goal is to analyze the provided study material and transform it into highly structured, premium-quality learning resources.
You MUST output your response in JSON format. Generate a JSON object containing ONLY the keys that correspond to the requested actions.

Requested Actions:
${actions.map(action => `- ${action}`).join("\n")}

JSON Schema specifications for each potential key (only include the requested ones):

1. If "summary" is requested, include a "summary" object:
{
  "summary": {
    "short": "A 1-2 sentence high-level summary.",
    "medium": "A 1-2 paragraph summary capturing the core arguments.",
    "detailed": "A comprehensive detailed summary outlining all main sections and sub-points."
  }
}

2. If "explainSimply" is requested, include an "explainSimply" string:
{
  "explainSimply": "An explanation of the content tailored for a teenager or beginner. Use simple terms, avoid jargon, and use relatable real-world analogies where appropriate."
}

3. If "keyPoints" is requested, include a "keyPoints" array of objects. Each point must have a relevant emoji/icon name:
{
  "keyPoints": [
    { "point": "The main point content...", "iconName": "Lightbulb" }
  ]
}
Note: The iconName must be a valid Lucide icon name, such as "Lightbulb", "Target", "Award", "Info", "BookOpen", "Star", "CheckCircle".

4. If "definitions" is requested, include a "definitions" array of objects representing a glossary:
{
  "definitions": [
    { "term": "Concept Name", "definition": "Clear explanation of the concept." }
  ]
}

5. If "flashcards" is requested, include a "flashcards" array of objects for studying:
{
  "flashcards": [
    { "front": "A question, term, or prompt.", "back": "The answer, explanation, or definition." }
  ]
}

6. If "quiz" is requested, include a "quiz" array of objects. Mix Multiple Choice, True/False, and Short Answer:
{
  "quiz": [
    {
      "question": "Question text...",
      "type": "multiple-choice",
      "options": ["Option A", "Option B", "Option C", "Option D"],
      "correctAnswer": "Option A"
    },
    {
      "question": "True/False Question text...",
      "type": "true-false",
      "options": ["True", "False"],
      "correctAnswer": "True"
    },
    {
      "question": "Short Answer Question text...",
      "type": "short-answer",
      "correctAnswer": "Brief correct answer guide."
    }
  ]
}

7. If "studyGuide" is requested, include a "studyGuide" object containing:
{
  "studyGuide": {
    "overview": "A clear overview of the topic.",
    "mainConcepts": [
      { "concept": "Concept Name", "description": "Detailed description." }
    ],
    "definitions": [
      { "term": "Term", "definition": "Definition" }
    ],
    "examples": ["Example 1...", "Example 2..."],
    "revisionNotes": "Structured bulleted or paragraphed notes summarizing the material.",
    "practiceQuestions": ["Question 1...", "Question 2..."],
    "studyTips": ["Tip 1...", "Tip 2..."]
  }
}

Ensure the content generated is highly educational, accurate, clear, and based directly on the provided text. If the text does not contain enough information for a specific section, use general educational knowledge to supplement it, but prioritize the provided document contents.
Do not wrap your response in markdown code blocks (e.g. \`\`\`json). Just return the raw JSON string.
`;

  const userPrompt = `Here is the study material to process:

${text}`;

  if (geminiKey) {
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${geminiKey}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          contents: [
            {
              parts: [
                {
                  text: systemPrompt + "\n\n" + userPrompt,
                },
              ],
            },
          ],
          generationConfig: {
            responseMimeType: "application/json",
          },
        }),
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Gemini API error: ${response.status} ${response.statusText} - ${errorText}`);
    }

    const data = await response.json();
    const resultText = data.candidates?.[0]?.content?.parts?.[0]?.text;
    if (!resultText) {
      throw new Error("Empty response from Gemini API.");
    }

    return JSON.parse(resultText);
  }

  if (groqKey) {
    const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${groqKey}`,
      },
      body: JSON.stringify({
        model: "llama-3.3-70b-versatile",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userPrompt },
        ],
        response_format: { type: "json_object" },
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Groq API error: ${response.status} ${response.statusText} - ${errorText}`);
    }

    const data = await response.json();
    const resultText = data.choices?.[0]?.message?.content;
    if (!resultText) {
      throw new Error("Empty response from Groq API.");
    }

    return JSON.parse(resultText);
  }

  if (openrouterKey) {
    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${openrouterKey}`,
        "HTTP-Referer": "https://studymateai.vercel.app",
        "X-Title": "StudyMate AI",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userPrompt },
        ],
        response_format: { type: "json_object" },
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`OpenRouter API error: ${response.status} ${response.statusText} - ${errorText}`);
    }

    const data = await response.json();
    const resultText = data.choices?.[0]?.message?.content;
    if (!resultText) {
      throw new Error("Empty response from OpenRouter API.");
    }

    return JSON.parse(resultText);
  }
}
