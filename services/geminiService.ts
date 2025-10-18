
import { GoogleGenAI, Type, Modality } from "@google/genai";
import { decodeAudioData } from '../utils/audioUtils';
import type { Recipe } from '../types';

const API_KEY = process.env.API_KEY;
if (!API_KEY) {
    throw new Error("API_KEY environment variable not set");
}
const ai = new GoogleGenAI({ apiKey: API_KEY });

const recipeSchema = {
    type: Type.OBJECT,
    properties: {
        title: {
            type: Type.STRING,
            description: "A creative and fitting title for the recipe."
        },
        description: {
            type: Type.STRING,
            description: "A short, appetizing description of the dish, 1-2 sentences."
        },
        ingredients: {
            type: Type.ARRAY,
            items: {
                type: Type.STRING,
            },
            description: "A list of all ingredients required, including quantities. Include common pantry items like oil, salt, and pepper."
        },
        instructions: {
            type: Type.ARRAY,
            items: {
                type: Type.STRING
            },
            description: "Step-by-step instructions to prepare the dish. Each step should be a separate string in the array."
        },
    },
    required: ["title", "description", "ingredients", "instructions"]
};


export const generateRecipeFromImage = async (base64Image: string, mimeType: string): Promise<Recipe> => {
    const prompt = `You are a creative chef specializing in reducing food waste. Based on the ingredients in this image, please identify them and create a delicious, simple recipe. Structure your response as a JSON object that conforms to the provided schema. The ingredients list should only contain the items you identified in the image, plus any common pantry staples required (like oil, salt, pepper). The instructions should be clear and concise, broken down into numbered steps.`;

    const imagePart = {
        inlineData: {
            data: base64Image,
            mimeType: mimeType,
        },
    };

    const textPart = {
        text: prompt,
    };

    const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: { parts: [imagePart, textPart] },
        config: {
            responseMimeType: 'application/json',
            responseSchema: recipeSchema,
        }
    });
    
    const jsonString = response.text.trim();
    return JSON.parse(jsonString) as Recipe;
};

export const generateSustainabilityTip = async (ingredients: string[]): Promise<string> => {
    const ingredientsString = ingredients.join(', ').replace(/ \(.*\)/g, ''); // Remove quantities for a cleaner prompt
    const prompt = `You are a sustainability expert. Based on the following ingredients: ${ingredientsString}, provide one short, actionable tip for reducing food waste related to one or more of these items. The tip should be no more than two sentences.`;

    const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt
    });

    return response.text;
};

export const textToSpeech = async (text: string, audioContext: AudioContext): Promise<AudioBuffer> => {
    const response = await ai.models.generateContent({
        model: "gemini-2.5-flash-preview-tts",
        contents: [{ parts: [{ text }] }],
        config: {
            responseModalities: [Modality.AUDIO],
            speechConfig: {
                voiceConfig: {
                    prebuiltVoiceConfig: { voiceName: 'Kore' },
                },
            },
        },
    });

    const base64Audio = response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
    if (!base64Audio) {
        throw new Error("No audio data received from API");
    }

    const binaryString = atob(base64Audio);
    const len = binaryString.length;
    const bytes = new Uint8Array(len);
    for (let i = 0; i < len; i++) {
        bytes[i] = binaryString.charCodeAt(i);
    }

    return decodeAudioData(bytes, audioContext, 24000, 1);
};
