
import { GoogleGenAI, Type, Schema } from "@google/genai";
import { ZyntaResponse, StyleAnalysisResponse, RefineResponse } from "../types";

const SYSTEM_INSTRUCTION = `
Siz ZYNTA AI - O‘zbek tilidagi professional kontent generatorisiz.

Sizning vazifangiz:
Foydalanuvchi kiritgan mavzu va ma'lumotlar asosida barcha platformalar uchun (Substack, Instagram, TikTok, YouTube, LinkedIn, Twitter, Telegram) to'liq, tushunarli va qiziqarli ssenariy/postlar yaratish.

Barcha matnlar O'ZBEK TILIDA bo'lishi shart.

------------------------------------------------------------
OUTPUT QOIDALARI (JSON SCHEMA)
------------------------------------------------------------
Javobni har doim quyidagi JSON formatida qaytaring:

{
  "content": {
    "substack": "",
    "instagram": {
      "reels_caption": "",
      "carousel_text": ""
    },
    "tiktok": "",
    "youtube": "",
    "linkedin": "",
    "twitter": "",
    "telegram": {
      "long": "",
      "short": ""
    }
  },
  "image_prompt": "",
  "analysis": {
    "keywords": [],
    "tone": "",
    "summary": ""
  }
}

Platformalar uchun yo'riqnoma:

1. **Substack, LinkedIn, YouTube, Telegram (Long)**:
   - Matnni 3 qismga bo'ling:
     a) **Kirish**: E’tiborni tortuvchi qisqa huk (hook).
     b) **Asosiy qism**: Faktlar, misollar, amaliy maslahatlar.
     c) **Yakun**: Xulosa va CTA (Call-to-Action - harakatga chaqiruvi).
   - Agar kerak bo'lsa, vizual tavsiyalarni matn orasida [Vizual: rasm/slayd tavsifi] shaklida bering.

2. **Instagram (Reels), TikTok**:
   - Qisqa, dinamik ssenariy.
   - Sarlavha (Hook) + Punchline.
   - [Kadr: ...] ko'rinishida vizual/kamera yo'nalishlarini bering.

3. **Twitter, Telegram (Short)**:
   - Qisqa, lo'nda, "Broadcast" uslubida.

------------------------------------------------------------
USLUB VA TONE
------------------------------------------------------------
Agar "user_style" berilgan bo'lsa:
- Foydalanuvchi uslubiga (rasmiy, samimiy, hazilkash va h.k.) moslashtiring.
- O'zbek tilining grammatik qoidalariga rioya qiling, lekin "jonli" tilda yozing.

------------------------------------------------------------
IMAGE PROMPT (Rasm uchun buyruq)
------------------------------------------------------------
"image_prompt" maydoni ingliz tilida bo'lishi kerak (generativ modellar uchun), lekin o'zbek madaniyati yoki mavzusiga oid detallarni o'z ichiga olishi mumkin.
Tarkibi: Sahna tavsifi, yoritish, ranglar, kayfiyat.

------------------------------------------------------------
XAVFSIZLIK
------------------------------------------------------------
- Zararli, haqoratli yoki noqonuniy kontent yaratmang.
- Har doim betaraf va aniq bo'ling.
`;

const STYLE_ANALYSIS_INSTRUCTION = `
Siz ZYNTA uslub tahlilchisisiz.

Vazifangiz: Foydalanuvchining yozish uslubini (3-10 ta namuna asosida) tahlil qilib, uning "raqamli barmoq izini" (style fingerprint) yaratish.

Javobni quyidagi JSON formatida qaytaring:

{
  "style_signature": {
    "tone": "", // Masalan: Rasmiy, Hazilkash, Ilmiy
    "sentence_structure": "", // Gap tuzilishi: Qisqa, Murakkab, Ritmik
    "vocabulary_patterns": "", // So'z boyligi xususiyatlari
    "pacing": "", // Temp: Tez, Vazmin
    "transitions": "", // O'tishlar: Silliq, Keskin
    "avoidances": "" // Nimalardan qochadi
  }
}

Tahlil O'zbek tilida yoki Ingliz tilida bo'lishi mumkin, lekin natija aniq va tushunarli bo'lishi kerak.
`;

const REFINE_INSTRUCTION = `
Siz ZYNTA qayta yozish (rewriting) motorisiz.

Vazifangiz: Berilgan matnni foydalanuvchi ko'rsatmasi asosida O'zbek tilida qayta yozish.

Ko'rsatmalar bo'lishi mumkin:
- Qisqartirish
- Kengaytirish
- Rasmiyroq qilish
- Ssenariyga aylantirish
- Ohangni o'zgartirish

Faqat qayta yozilgan matnni JSON formatida qaytaring:

{
  "rewritten_text": ""
}
`;

const responseSchema: Schema = {
  type: Type.OBJECT,
  properties: {
    content: {
      type: Type.OBJECT,
      properties: {
        substack: { type: Type.STRING },
        instagram: {
          type: Type.OBJECT,
          properties: {
            reels_caption: { type: Type.STRING },
            carousel_text: { type: Type.STRING },
          },
          required: ["reels_caption", "carousel_text"],
        },
        tiktok: { type: Type.STRING },
        youtube: { type: Type.STRING },
        linkedin: { type: Type.STRING },
        twitter: { type: Type.STRING },
        telegram: {
          type: Type.OBJECT,
          properties: {
            long: { type: Type.STRING },
            short: { type: Type.STRING },
          },
          required: ["long", "short"],
        },
      },
      required: ["substack", "instagram", "tiktok", "youtube", "linkedin", "twitter", "telegram"],
    },
    image_prompt: { type: Type.STRING },
    analysis: {
      type: Type.OBJECT,
      properties: {
        keywords: {
          type: Type.ARRAY,
          items: { type: Type.STRING },
        },
        tone: { type: Type.STRING },
        summary: { type: Type.STRING },
      },
      required: ["keywords", "tone", "summary"],
    },
  },
  required: ["content", "image_prompt", "analysis"],
};

const styleAnalysisSchema: Schema = {
  type: Type.OBJECT,
  properties: {
    style_signature: {
      type: Type.OBJECT,
      properties: {
        tone: { type: Type.STRING },
        sentence_structure: { type: Type.STRING },
        vocabulary_patterns: { type: Type.STRING },
        pacing: { type: Type.STRING },
        transitions: { type: Type.STRING },
        avoidances: { type: Type.STRING },
      },
      required: ["tone", "sentence_structure", "vocabulary_patterns", "pacing", "transitions", "avoidances"],
    },
  },
  required: ["style_signature"],
};

const refineSchema: Schema = {
  type: Type.OBJECT,
  properties: {
    rewritten_text: { type: Type.STRING },
  },
  required: ["rewritten_text"],
};

// Convert File to base64 string
const fileToGenerativePart = async (file: File) => {
  return new Promise<{ inlineData: { data: string; mimeType: string } }>((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      const base64String = reader.result as string;
      // Remove the data URL prefix (e.g., "data:image/jpeg;base64,")
      const base64Data = base64String.split(",")[1];
      resolve({
        inlineData: {
          data: base64Data,
          mimeType: file.type,
        },
      });
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
};

export const generateContent = async (
  prompt: string,
  userStyle?: string,
  files?: File[]
): Promise<ZyntaResponse> => {
  const apiKey = process.env.API_KEY;
  if (!apiKey) {
    throw new Error("API Key not found in environment variables.");
  }

  const ai = new GoogleGenAI({ apiKey });

  let finalPrompt = `Vazifa: Quyidagi ma'lumotlar asosida O'zbek tilida multi-platforma kontent yaratish.\n\n`;
  
  // Mapping inputs to the Task Logic defined in System Instruction
  if (prompt) {
    // Use triple quotes to handle potential multi-line or quoted user input safely
    finalPrompt += `Mavzu/Matn: """${prompt}"""\n`;
  }

  if (userStyle) {
    finalPrompt += `Foydalanuvchi uslubi: """${userStyle}"""\n`;
  }

  // Note: If files are provided (audio/images), they are added as parts.
  // The system instruction handles "audio_transcript" behavior implicitly via multimodal capabilities
  // when an audio file is present in the parts list.

  const parts: any[] = [{ text: finalPrompt }];

  if (files && files.length > 0) {
    for (const file of files) {
      const filePart = await fileToGenerativePart(file);
      parts.push(filePart);
    }
  }

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: { parts },
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
        responseMimeType: "application/json",
        responseSchema: responseSchema,
      },
    });

    const text = response.text;
    if (!text) throw new Error("No response received from Gemini.");

    return JSON.parse(text) as ZyntaResponse;
  } catch (error) {
    console.error("Generation error:", error);
    throw error;
  }
};

export const analyzeWritingStyle = async (
  samples: string,
  files?: File[]
): Promise<StyleAnalysisResponse> => {
  const apiKey = process.env.API_KEY;
  if (!apiKey) {
    throw new Error("API Key not found in environment variables.");
  }

  const ai = new GoogleGenAI({ apiKey });

  let finalPrompt = `Quyidagi yozuv namunalarini tahlil qiling va uslub barmoq izini (style fingerprint) yarating.\n\n`;
  
  if (samples) {
    // Split by double newlines to treat as separate samples, then format as JSON array
    const sampleList = samples.split(/\n\n+/).map(s => s.trim()).filter(s => s.length > 0);
    finalPrompt += `samples: ${JSON.stringify(sampleList, null, 2)}\n`;
  }

  const parts: any[] = [{ text: finalPrompt }];

  if (files && files.length > 0) {
    for (const file of files) {
      const filePart = await fileToGenerativePart(file);
      parts.push(filePart);
    }
  }

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: { parts },
      config: {
        systemInstruction: STYLE_ANALYSIS_INSTRUCTION,
        responseMimeType: "application/json",
        responseSchema: styleAnalysisSchema,
      },
    });

    const text = response.text;
    if (!text) throw new Error("No response received from Gemini.");

    return JSON.parse(text) as StyleAnalysisResponse;
  } catch (error) {
    console.error("Style Analysis error:", error);
    throw error;
  }
};

export const refineContent = async (
  text: string,
  instruction: string
): Promise<string> => {
  const apiKey = process.env.API_KEY;
  if (!apiKey) {
    throw new Error("API Key not found in environment variables.");
  }

  const ai = new GoogleGenAI({ apiKey });

  const finalPrompt = `Quyidagi matnni ko'rsatmalarga binoan qayta yozing.

Matn: """${text}"""
Ko'rsatma: """${instruction}"""`;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: { parts: [{ text: finalPrompt }] },
      config: {
        systemInstruction: REFINE_INSTRUCTION,
        responseMimeType: "application/json",
        responseSchema: refineSchema,
      },
    });

    const responseText = response.text;
    if (!responseText) throw new Error("No response received from Gemini.");

    const json = JSON.parse(responseText) as RefineResponse;
    return json.rewritten_text;
  } catch (error) {
    console.error("Refinement error:", error);
    throw error;
  }
};
