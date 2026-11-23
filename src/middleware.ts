import { NextResponse, type NextRequest } from "next/server";

// www -> apex in one hop, keeping the exact path (incl. trailing slash) and query.
// (Vercel did this at its edge; on Cloudflare the app does it.)
export function middleware(req: NextRequest) {
  if (req.headers.get("host") === "www.comicbookstores.co") {
    const url = new URL(req.url);
    url.protocol = "https:";
    url.host = "comicbookstores.co";
    url.port = "";
    return NextResponse.redirect(url.toString(), 308);
  }
  return NextResponse.next();
}
