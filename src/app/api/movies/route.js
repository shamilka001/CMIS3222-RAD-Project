import { db } from "@/lib/db";
import { movies } from "@/lib/schema";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const data = await db.select().from(movies);
    
    // Explicit safety mapping to catch case mismatch bugs between Neon and JS
    const sanitizedData = data.map(movie => ({
      id: movie.id,
      title: movie.title,
      genre: movie.genre,
      rating: movie.rating,
      // If Drizzle returns 'poster_url', use it; otherwise fall back to 'posterUrl'
      posterUrl: movie.poster_url || movie.posterUrl || null 
    }));

    return NextResponse.json(sanitizedData);
  } catch (err) {
    console.error("Backend DB Fetch Error:", err);
    return NextResponse.json({ error: "Failed fetching rows" }, { status: 500 });
  }
}