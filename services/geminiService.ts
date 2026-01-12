
import { GoogleGenAI } from "@google/genai";

const API_KEY = process.env.API_KEY || "";

export const transformToProfessionalPortrait = async (
  base64Image: string,
  style: string
): Promise<string> => {
  const ai = new GoogleGenAI({ apiKey: API_KEY });
  
  // Extract base64 data without the prefix
  const base64Data = base64Image.split(',')[1];
  const mimeType = base64Image.split(',')[0].split(':')[1].split(';')[0];

  const stylePrompts = {
    'Business Formal': 'The person should be wearing a high-end dark business suit with a crisp white shirt and tie (if applicable) or a professional blazer. Professional studio lighting with a clean, solid light grey background.',
    'Smart Casual': 'The person should be wearing a neat polo shirt, a sweater, or a casual blazer without a tie. Soft, natural studio lighting with a warm neutral background.',
    'Creative Studio': 'A modern, stylish professional look. Slightly more dynamic lighting and a sophisticated deep blue or textured grey studio background.'
  };

  const prompt = `
    Transform this person's photo into a professional, high-quality resume headshot.
    Strictly follow these requirements:
    1. KEEP THE PERSON'S FACIAL IDENTITY IDENTICAL. Do not change their ethnic features, facial structure, or expression drastically.
    2. CLOTHING: ${stylePrompts[style as keyof typeof stylePrompts]}.
    3. SETTING: Professional studio environment. High-end professional camera quality (1K resolution).
    4. LIGHTING: Balanced three-point studio lighting to enhance facial features and remove harsh shadows.
    5. COMPOSITION: Centered head-and-shoulders portrait.
    6. Ensure the final result looks like a real photo taken in a photography studio, not an illustration.
  `;

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
            text: prompt,
          },
        ],
      },
    });

    let resultImageUrl = '';
    
    // Find the image part in candidates
    const candidate = response.candidates?.[0];
    if (candidate?.content?.parts) {
      for (const part of candidate.content.parts) {
        if (part.inlineData) {
          resultImageUrl = `data:${part.inlineData.mimeType};base64,${part.inlineData.data}`;
          break;
        }
      }
    }

    if (!resultImageUrl) {
      throw new Error("Failed to generate an image part in the response.");
    }

    return resultImageUrl;
  } catch (error) {
    console.error("Gemini Image Transformation Error:", error);
    throw error;
  }
};
