import { NextResponse } from "next/server";
import { getShops } from "@/lib/printify";

export async function GET() {
  try {
    const shops = await getShops();
    return NextResponse.json({ shops });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
