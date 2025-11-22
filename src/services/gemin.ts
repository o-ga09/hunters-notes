import { GoogleGenAI, Type } from "@google/genai";
import { Monster } from "../lib/types";

// Initialize Gemini API Client
const ai = new GoogleGenAI({ apiKey: import.meta.env.VITE_API_KEY });

export class GeminiService {
  private static modelName = "gemini-2.5-flash";

  static async searchMonster(monsterName: string): Promise<Monster | null> {
    try {
      const response = await ai.models.generateContent({
        model: this.modelName,
        contents: `Provide detailed ecological data for the Monster Hunter monster: "${monsterName}".
        If the monster does not exist in the Monster Hunter franchise, return null (or empty object).
        Ensure Japanese translations for Name and specific terms are accurate to the game.
        Language: Japanese.`,
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              name: {
                type: Type.STRING,
                description: "The official Japanese name of the monster",
              },
              title: {
                type: Type.STRING,
                description:
                  "The title like '火竜' or 'King of the Skies' in Japanese",
              },
              species: {
                type: Type.STRING,
                description: "Species classification (e.g., Flying Wyvern)",
              },
              description: {
                type: Type.STRING,
                description:
                  "A rich, atmospheric description of the monster, roughly 100-200 characters.",
              },
              elements: { type: Type.ARRAY, items: { type: Type.STRING } },
              ailments: { type: Type.ARRAY, items: { type: Type.STRING } },
              weaknesses: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    element: { type: Type.STRING },
                    stars: {
                      type: Type.INTEGER,
                      description: "Effectiveness from 1 (low) to 3 (high)",
                    },
                  },
                },
              },
              habitats: { type: Type.ARRAY, items: { type: Type.STRING } },
              threatLevel: {
                type: Type.INTEGER,
                description: "Threat level from 1 to 10",
              },
              size: {
                type: Type.OBJECT,
                properties: {
                  min: {
                    type: Type.NUMBER,
                    description: "Small crown size in cm",
                  },
                  max: {
                    type: Type.NUMBER,
                    description: "King crown size in cm",
                  },
                },
              },
              keyDrops: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    name: { type: Type.STRING },
                    rarity: { type: Type.INTEGER },
                  },
                },
              },
              tips: {
                type: Type.ARRAY,
                items: { type: Type.STRING },
                description: "3 strategic hunting tips",
              },
            },
            required: [
              "name",
              "title",
              "description",
              "elements",
              "weaknesses",
            ],
          },
        },
      });

      const text = response.text;
      if (!text) return null;

      const data = JSON.parse(text) as Monster;
      // Basic validation to check if it's a valid response or empty
      if (!data.name) return null;

      return data;
    } catch (error) {
      console.error("Gemini API Error:", error);
      throw error;
    }
  }
}
