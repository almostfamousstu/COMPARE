import { NextResponse } from "next/server";
import { GoogleGenerativeAI, SchemaType } from "@google/generative-ai";

interface CompareRequestBody {
  sku?: string;
  userKVPairs?: Record<string, string>;
}

const SYSTEM_PROMPT = `You are a SKU Specification Generator. Given a SKU identifier and a list of attribute names, respond only with JSON that maps each attribute name to a concise string value that best represents the SKU's specification. Do not include any additional fields or prose. If you are unsure, provide your best informed estimate rather than saying unknown.`;

export async function POST(request: Request) {
  const body = (await request.json().catch(() => null)) as CompareRequestBody | null;

  if (!body || typeof body !== "object") {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  }

  const { sku, userKVPairs } = body;

  if (!sku || typeof sku !== "string" || !sku.trim()) {
    return NextResponse.json({ error: "SKU is required" }, { status: 400 });
  }

  if (!userKVPairs || typeof userKVPairs !== "object") {
    return NextResponse.json({ error: "userKVPairs must be an object" }, { status: 400 });
  }

  const cleanedPairs = Object.fromEntries(
    Object.entries(userKVPairs).map(([key, value]) => [String(key), String(value)])
  );

  const keys = Object.keys(cleanedPairs);
  if (keys.length === 0) {
    return NextResponse.json({ error: "Provide at least one attribute to compare" }, { status: 400 });
  }

  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return NextResponse.json({ error: "GEMINI_API_KEY is not configured" }, { status: 500 });
  }

  try {
    const client = new GoogleGenerativeAI(apiKey);
    const model = client.getGenerativeModel({
      model: "gemini-2.5-flash",
      systemInstruction: SYSTEM_PROMPT
    });

    const schema = {
      type: SchemaType.OBJECT,
      properties: keys.reduce<Record<string, { type: SchemaType; description: string }>>(
        (acc, key) => {
          acc[key] = {
            type: SchemaType.STRING,
            description: `Value for ${key}`
          };
          return acc;
        },
        {}
      ),
      required: keys,
      additionalProperties: false
    } as const;

    const result = await model.generateContent({
      contents: [
        {
          role: "user",
          parts: [
            {
              text: `SKU: ${sku.trim()}\nAttributes: ${keys.join(", ")}\nReturn JSON with these exact keys.`
            }
          ]
        }
      ],
      generationConfig: {
        responseMimeType: "application/json",
        responseSchema: schema
      }
    });

    const text = result.response?.text();
    if (!text) {
      throw new Error("Gemini returned an empty response");
    }

    const llmKVPairs = JSON.parse(text) as Record<string, string>;

    return NextResponse.json({ llmKVPairs });
  } catch (error) {
    console.error("Gemini compare error", error);
    return NextResponse.json({ error: "Failed to generate comparison" }, { status: 500 });
  }
}
