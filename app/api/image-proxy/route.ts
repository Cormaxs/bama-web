import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const fileUrl = searchParams.get("url");
  const fileId = searchParams.get("id");
  const size = searchParams.get("size");
  if (!fileUrl && !fileId) {
    return new NextResponse("URL o ID no proporcionado", { status: 400 });
  }

  // Build a safe target URL (prefer Drive direct-download when id is provided)
  let targetUrl = fileUrl ?? undefined;
  if (fileId) {
    targetUrl = `https://drive.google.com/uc?export=download&id=${encodeURIComponent(fileId)}`;
  } else if (fileUrl) {
    // Extract Drive id from common patterns so we can redirect to a Drive endpoint
    if (fileUrl.includes("/d/")) {
      const extractedId = fileUrl.split("/d/")[1]?.split("/")[0];
      if (extractedId) targetUrl = `https://drive.google.com/uc?export=download&id=${encodeURIComponent(extractedId)}`;
    } else if (fileUrl.includes("open?id=")) {
      const extractedId = fileUrl.split("open?id=")[1]?.split("&")[0];
      if (extractedId) targetUrl = `https://drive.google.com/uc?export=download&id=${encodeURIComponent(extractedId)}`;
    }
  }

  // If a size hint was provided and the target looks like a Google-hosted image, append =s{size}
  if (size && targetUrl && /googleusercontent|lh3.googleusercontent|googleapis/.test(targetUrl)) {
    if (!targetUrl.includes("=s")) targetUrl = `${targetUrl}=s${encodeURIComponent(size)}`;
  }

  // IMPORTANT: instead of fetching the file server-side (which can timeout or exhaust memory),
  // redirect the requester to the original/Drive URL. The browser will handle the download/preview.
  if (!targetUrl) {
    return new NextResponse("URL o ID no válido", { status: 400 });
  }

  return NextResponse.redirect(targetUrl);
}
