import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const username = searchParams.get("username");

    if (!username) {
      return NextResponse.json({ valid: false, error: "Username is required" }, { status: 400 });
    }

    const cleanUsername = username.replace(/^@/, "").trim();

    if (!/^[A-Za-z0-9._]+$/.test(cleanUsername)) {
      return NextResponse.json({ valid: false, error: "Invalid username format" });
    }

    try {
      const response = await fetch(`https://www.instagram.com/${cleanUsername}/`, {
        headers: {
          "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
        },
        redirect: "follow",
      });

      if (response.ok) {
        const html = await response.text();
        const isValid = !html.includes("Sorry, this page isn't available") && 
                        !html.includes("The link you followed may be broken") &&
                        !html.includes("Page Not Found");
        return NextResponse.json({ valid: isValid });
      } else if (response.status === 404) {
        return NextResponse.json({ valid: false });
      } else {
        return NextResponse.json({ valid: true });
      }
    } catch {
      return NextResponse.json({ valid: true });
    }
  } catch (error) {
    console.error("Instagram verification error:", error);
    return NextResponse.json({ valid: true });
  }
}
