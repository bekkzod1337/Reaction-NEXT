import { NextResponse } from "next/server";
import { promises as fs } from "fs";
import path from "path";

const filePath = path.join(process.cwd(), "scores.json");

type Score = {
  username: string;
  score: number;
};

export async function GET() {
  try {
    const data = await fs.readFile(filePath, "utf-8");
    return NextResponse.json(JSON.parse(data));
  } catch {
    // Fayl bo‘lmasa yoki xatolik bo‘lsa — bo‘sh array qaytaramiz
    return NextResponse.json({ scores: [] });
  }
}

export async function POST(req: Request) {
  const { username, score } = await req.json();

  let scores: Score[] = [];
  try {
    const data = await fs.readFile(filePath, "utf-8");
    scores = JSON.parse(data).scores || [];
  } catch {
    scores = [];
  }

  scores.push({ username, score });

  await fs.writeFile(
    filePath,
    JSON.stringify({ scores }, null, 2),
    "utf-8"
  );

  return NextResponse.json({ success: true, scores });
}
