
import { GoogleGenAI } from "@google/genai";

export const editImage = async (base64ImageData: string): Promise<string | null> => {
  // Extract pure base64 data from data URL
  const base64Data = base64ImageData.split(',')[1];
  const mimeType = base64ImageData.split(';')[0].split(':')[1];

  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image',
      contents: {
        parts: [
          {
            inlineData: {
              data: base64Data,
              mimeType: mimeType,
            },
          },
          {
            text: "Based on this portrait, please maintain the person's exact facial features and identity. Change the background to a sophisticated, modern IT startup office with clean white desks, some plants, and warm lighting. Change the person's clothing to a clean business casual style, such as a stylish blazer or a neat button-down shirt. Ensure the lighting and overall composition looks professional and high-quality, as if taken for a LinkedIn or Instagram profile.",
          },
        ],
      },
    });

    for (const part of response.candidates?.[0]?.content?.parts || []) {
      if (part.inlineData) {
        return `data:image/png;base64,${part.inlineData.data}`;
      }
    }
    
    return null;
  } catch (error) {
    console.error("Gemini API Error:", error);
    throw error;
  }
};
