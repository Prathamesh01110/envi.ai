import { NextResponse } from "next/server";
import translate from "translate-google-api";

export async function POST(req: Request) {
  try {
    const { text, sourceLang, targetLang } = await req.json();

    if (!text || !targetLang) {
      return NextResponse.json({ error: "Missing required parameters" }, { status: 400 });
    }

    const result = await translate(text, { from: sourceLang || "auto", to: targetLang });

    return NextResponse.json({ translatedText: result[0] }, { status: 200 });
  } catch (error) {
    console.error("Translation error:", error);
    return NextResponse.json({ error: "Translation failed" }, { status: 500 });
  }
}
