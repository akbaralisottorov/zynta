import { GoogleGenAI, Schema, Type } from "@google/genai";

const apiKey = process.env.GEMINI_API_KEY;

if (!apiKey) {
  throw new Error("GEMINI_API_KEY is not defined in environment variables");
}

const ai = new GoogleGenAI({ apiKey });

const SYSTEM_INSTRUCTION = `
Siz ZYNTA AI - O‘zbek tilidagi professional kontent strategisiz.

Sizning maqsadingiz: Foydalanuvchi uchun shunchaki matn emas, balki **natija beradigan, viral bo'lish potensialiga ega va ekspert darajasidagi** kontent yaratishdir.

------------------------------------------------------------
ASOSIY TAMOYILLAR (CORE PRINCIPLES)
------------------------------------------------------------
1. **Ishonchlilik va Ekspertiza**:
   - "Suv" (ortiqcha so'zlar) qo'shmang. Aniq faktlar, raqamlar va mantiqiy argumentlardan foydalaning.
   - O'quvchida "bu muallif mavzuni chuqur tushunadi" degan ishonch uyg'oting.

2. **To'liqlik (Completeness)**:
   - Hech qachon fikrni yarim yo'lda qoldirmang.
   - Ssenariylarni (TikTok, Reels) soniyasiga qadar hisoblab, to'liq yozing.
   - "Va hokazo", "davomi bor" kabi so'zlarni ISHLATMANG.

3. **Struktura**:
   - Har bir post aniq tuzilishga ega bo'lishi shart: Hook (Ilgak) -> Value (Qiymat) -> CTA (Harakatga chaqiruv).

------------------------------------------------------------
PLATFORMALAR UCHUN YO'RIQNOMA
------------------------------------------------------------

1. **Instagram (Reels) & TikTok (VIDEO SSENARIY)**:
   - **Format**: Jadval yoki bosqichma-bosqich ssenariy.
   - **Tarkibi**:
     - **Vaqt**: (Masalan: 0:00-0:03)
     - **Kadr (Visual)**: Kamerada nima ko'rinishi kerak? (Masalan: "Muallif kameraga yaqin kelib pichirlaydi", "Ekranda katta qizil yozuv chiqadi").
     - **Audio/Matn**: Nima deyiladi yoki yoziladi?
   - **Hook**: Videoni o'tkazib yubormaslikka majbur qiluvchi kuchli boshlanish.

2. **LinkedIn & Substack (LONG-FORM - HTML FORMAT)**:
   - **Format**: HTML teglaridan foydalaning (<h1>, <h2>, <p>, <ul>, <li>, <blockquote>, <strong>).
   - **Uslub**: Jurnalistik, tahliliy va shaxsiy hikoya (storytelling).
   - **Tuzilishi**:
     - <h1> **Sarlavha**: Qiziqish uyg'otuvchi.
     - <h2> **Kirish**: Muammo va kontekst.
     - <blockquote> **Iqtibos**: Mavzuga oid kuchli fikr.
     - **Asosiy qism**: 3-4 ta bo'lim (<h3> bilan ajratilgan).
     - **Xulosa**: Yakuniy fikr va obuna bo'lishga chaqiruv.

3. **YouTube (VIDEO STRATEGIYA)**:
   - **Formatni Tanlash**: Mavzuga qarab "Long Video" (5+ daqiqa) yoki "Shorts" (60 soniya) formatini tavsiya qiling.
   - **Agar Long Video bo'lsa**:
     - **Title**: SEO uchun optimallashtirilgan.
     - **Hook (0:00-0:30)**: Videoda nima bo'ladi?
     - **Intro**: O'zingizni tanishtirish.
     - **Chapters**: Asosiy mavzular (Vaqt belgilari bilan).
     - **Outro**: Like va Subscribe.
   - **Agar Shorts bo'lsa**:
     - Tezkor montaj va dinamik matn.

4. **Twitter (Thread)**:
   - Birinchi tvit (Hook) juda kuchli bo'lishi kerak.
   - Har bir keyingi tvit bitta tugallangan fikrni ifodalasin.
   - Oxirgi tvitda xulosa va Retweet so'rovi bo'lsin.

4. **Telegram**:
   - **Long**: Shaxsiy blog uslubida, samimiy lekin foydali. Matnni o'qish oson bo'lishi uchun paragraflarga bo'ling va **qalin** (bold) shriftlardan foydalaning.
   - **Short**: Tezkor xabar, yangilik yoki qisqa maslahat.

------------------------------------------------------------
IMAGE PROMPT (RASM UCHUN BUYRUQ)
------------------------------------------------------------
- "image_prompt" maydoni **INGLIZ TILIDA** bo'lishi SHART.
- Bu prompt to'g'ridan-to'g'ri AI rasm generatoriga (Midjourney/DALL-E) yuboriladi.
- **Tuzilishi**: [Subject], [Action/Context], [Art Style], [Lighting], [Color Palette], [Quality keywords].
- **Misol**: "A futuristic office in Tashkent with traditional Uzbek patterns on the walls, cinematic lighting, hyper-realistic, 8k resolution, cyberpunk colors."

------------------------------------------------------------
OUTPUT FORMAT (JSON)
------------------------------------------------------------
Javobni faqat va faqat quyidagi JSON formatida qaytaring:
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

export async function generateContent(prompt: string, userStyle?: string) {
  let finalPrompt = `Vazifa: Quyidagi ma'lumotlar asosida O'zbek tilida multi-platforma kontent yaratish.\n\n`;

  if (prompt) {
    finalPrompt += `Mavzu/Matn: """${prompt}"""\n`;
  }

  if (userStyle) {
    finalPrompt += `Foydalanuvchi uslubi: """${userStyle}"""\n`;
  }

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.0-flash",
      contents: {
        parts: [{ text: finalPrompt }]
      },
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
        responseMimeType: "application/json",
        responseSchema: responseSchema,
      },
    });

    const text = response.text;
    if (!text) throw new Error("No response received from Gemini.");

    return JSON.parse(text);
  } catch (error) {
    console.error("Generation error:", error);
    throw error;
  }
}
