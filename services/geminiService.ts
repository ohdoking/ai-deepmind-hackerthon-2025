import { GoogleGenAI, Type } from "@google/genai";
import { GameScenario } from "../types";

// Initialize Gemini Client
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const SYSTEM_INSTRUCTION = `
You are 'Antigravity', a "Lead Scenario Analyst" and "Technical Lead" for a game development agent.
Your goal is to generate data for an HTML/JS based RPG game for child safety education regarding animals.

[Basic Rules]
1. Analysis: Analyze the provided image (child and animal) to identify the SPECIFIC animal type (e.g., "Golden Retriever", "Wild Bear", "Stray Cat"), distance, and potential risks.
2. Output Format: Strictly follow the JSON schema. No markdown code blocks.
3. Artistic Style: Reward cards must target 'Alphonse Mucha' Art Nouveau style.
`;

export const analyzeSafetyScenario = async (base64Image: string, mimeType: string): Promise<GameScenario> => {
  try {
    const model = "gemini-2.5-flash"; 

    const response = await ai.models.generateContent({
      model: model,
      contents: {
        parts: [
          {
            inlineData: {
              mimeType: mimeType,
              data: base64Image,
            },
          },
          {
            text: `Analyze this photo and generate a game scenario JSON for child-animal boundary respect education.
            
            IMPORTANT: Set 'npc_type' to the specific name of the animal or object identified (e.g., "Sleeping Wolf", "Guardian Robot", "Friendly Cat"). This name will appear in the game dialogue.

            JSON Schema:
            {
              "scenario_id": "unique_id_string",
              "npc_type": "Specific Animal/Object Name",
              "trigger_area_px": 100,
              "question": "RPG Dialogue Question based on the risk",
              "options": [
                {
                  "text": "Choice 1 (Bad behavior)",
                  "is_correct": false,
                  "reward_card_prompt": "Alphonse Mucha style prompt description for Bad Result Card (darker tone, warning)"
                },
                {
                  "text": "Choice 2 (Good behavior)",
                  "is_correct": true,
                  "reward_card_prompt": "Alphonse Mucha style prompt description for Good Result Card (warm colors, Art Nouveau)"
                }
              ],
              "dialogue_success": "Dialogue for correct answer",
              "dialogue_fail": "Dialogue for wrong answer"
            }`
          }
        ]
      },
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            scenario_id: { type: Type.STRING },
            npc_type: { type: Type.STRING },
            trigger_area_px: { type: Type.NUMBER },
            question: { type: Type.STRING },
            options: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  text: { type: Type.STRING },
                  is_correct: { type: Type.BOOLEAN },
                  reward_card_prompt: { type: Type.STRING }
                }
              }
            },
            dialogue_success: { type: Type.STRING },
            dialogue_fail: { type: Type.STRING }
          }
        }
      }
    });

    if (!response.text) {
      throw new Error("No response from Gemini");
    }

    const json = JSON.parse(response.text);
    return json as GameScenario;

  } catch (error) {
    console.error("Error analyzing scenario:", error);
    throw error;
  }
};

export const generateRewardCard = async (prompt: string): Promise<string> => {
  try {
    const model = "gemini-3-pro-image-preview"; 

    const response = await ai.models.generateContent({
      model: model,
      contents: {
        parts: [
          {
            text: `Create an Art Nouveau (Alphonse Mucha style) illustration. ${prompt}. High quality, detailed, 4:3 aspect ratio.`
          }
        ]
      },
      config: {
        imageConfig: {
          aspectRatio: "4:3",
          imageSize: "1K" 
        }
      }
    });

    for (const part of response.candidates?.[0]?.content?.parts || []) {
      if (part.inlineData) {
        return `data:${part.inlineData.mimeType};base64,${part.inlineData.data}`;
      }
    }

    throw new Error("No image data found in response");
  } catch (error) {
    console.error("Error generating reward card:", error);
    return "https://picsum.photos/800/600?grayscale&blur=2"; 
  }
};
