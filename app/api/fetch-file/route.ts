import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const fileUrl = searchParams.get("url");
  const fileId = searchParams.get("id");

  if (!fileUrl && !fileId) {
    return new NextResponse("URL o ID no proporcionado", { status: 400 });
  }

  let targetUrl = fileUrl ?? undefined;
  if (fileId) {
    targetUrl = `https://drive.google.com/uc?export=download&id=${encodeURIComponent(fileId)}`;
  } else if (fileUrl) {
    // try to normalize Drive links
    if (fileUrl.includes("/d/")) {
      const extractedId = fileUrl.split("/d/")[1]?.split("/")[0];
      if (extractedId) targetUrl = `https://drive.google.com/uc?export=download&id=${encodeURIComponent(extractedId)}`;
    } else if (fileUrl.includes("open?id=")) {
      const extractedId = fileUrl.split("open?id=")[1]?.split("&")[0];
      if (extractedId) targetUrl = `https://drive.google.com/uc?export=download&id=${encodeURIComponent(extractedId)}`;
    }
  }

  if (!targetUrl) return new NextResponse("URL no válida", { status: 400 });

  try {
    const resp = await fetch(targetUrl);
    if (!resp.ok) return new NextResponse(`Error fetching source: ${resp.status}`, { status: resp.status });

    const contentType = resp.headers.get("content-type") || "application/octet-stream";
    const buffer = await resp.arrayBuffer();

    return new NextResponse(Buffer.from(buffer), {
      status: 200,
      headers: {
        "Content-Type": contentType,
        "Access-Control-Allow-Origin": "*",
        "Cache-Control": "private, max-age=0",
      },
    });
  } catch (err) {
    console.error("fetch-file error:", err);
    return new NextResponse("Error interno al obtener el archivo", { status: 500 });
  }
}
