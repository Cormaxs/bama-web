"use client";

import { useState, useEffect, useRef, useCallback, useMemo } from "react";
import LazyImage from "@/components/lazy-image";
import JSZip from "jszip";
import { saveAs } from "file-saver";

interface MediaFile {
  id: string;
  name: string;
  mimeType?: string;
  url?: string;
  size?: number;
  createdTime?: string;
}

interface MediaFolder {
  id: string;
  name: string;
  folders?: MediaFolder[];
  files?: MediaFile[];
}

export default function PhotoViewer({ data }: { data: MediaFolder }) {
  const [currentFolder, setCurrentFolder] = useState<MediaFolder>(data);
  const [currentIndex, setCurrentIndex] = useState<number | null>(null);
  const [isDownloadingZip, setIsDownloadingZip] = useState(false);

  const touchStartX = useRef<number>(0);
  const touchEndX = useRef<number>(0);

  const files = useMemo(() => currentFolder.files || [], [currentFolder]);
  const activeFile = currentIndex !== null ? files[currentIndex] : null;

  // 1. Miniaturas rápidas para la grilla (baja resolución optimizada)
  const getThumbnailUrl = (file: MediaFile) => {
    if (!file?.url) return "";
    return `${file.url}=w200-h200-c`;
  };

  // 2. Imagen en grande para el visor (alta resolución visualizable)
  const getLargeUrl = (file: MediaFile) => {
    if (!file?.url) return "";
    return `${file.url}=s1600`;
  };

  // 3. URL estricta para descarga en tamaño original por ID
  const getDownloadUrl = (file: MediaFile) => {
    if (file.id) return `/api/image-proxy?id=${encodeURIComponent(file.id)}`;
    return `/api/image-proxy?url=${encodeURIComponent(file.url || "")}`;
  };

  // Server-side fetch endpoint to retrieve the binary so client can zip without CORS redirects
  const getFetchFileUrl = (file: MediaFile) => {
    if (file.id) return `/api/fetch-file?id=${encodeURIComponent(file.id)}`;
    return `/api/fetch-file?url=${encodeURIComponent(file.url || "")}`;
  };

  // --- DESCARGAR ARCHIVO INDIVIDUAL ---
  const handleDownloadSingle = (file: MediaFile, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();

    // Abrir la URL de descarga en una nueva pestaña para que el navegador maneje
    // la descarga del binario grande (evita timeouts y problemas de memoria).
    try {
      const url = getDownloadUrl(file);
      window.open(url, "_blank", "noopener,noreferrer");
    } catch (error) {
      console.error("Error al iniciar la descarga:", error);
    }
  };

  // --- DESCARGAR ÁLBUM COMPLETO EN ZIP ---
  const handleDownloadAlbum = async () => {
    if (files.length === 0 || isDownloadingZip) return;

    setIsDownloadingZip(true);

    try {
      // Always attempt client-side zipping of originals (sequential to reduce peak concurrency)
      const zip = new JSZip();
      const folderZip = zip.folder(currentFolder.name || "album");

      for (const file of files) {
        try {
          const response = await fetch(getFetchFileUrl(file));
          if (!response.ok) throw new Error(`Error fetching ${file.name}: ${response.status}`);
          const blob = await response.blob();
          folderZip?.file(file.name, blob);
          // yield to the event loop between large fetches
          await new Promise((r) => setTimeout(r, 50));
        } catch (innerErr) {
          console.error(`Fallo descargando ${file.name}:`, innerErr);
          // continue with remaining files
        }
      }

      const content = await zip.generateAsync({ type: "blob" });
      saveAs(content, `${currentFolder.name}-album-originales.zip`);
    } catch (error) {
      console.error("Error al generar el ZIP:", error);
      // Fallback: generate a links file so user can download originals manually
      try {
        const links = files.map((f) => `${f.name}: ${window.location.origin}${getDownloadUrl(f)}`).join("\n");
        const blob = new Blob([links], { type: "text/plain;charset=utf-8" });
        saveAs(blob, `${currentFolder.name}-download-links-fallback.txt`);
      } catch (e) {
        console.error("Error al generar el archivo de links de respaldo:", e);
      }
    } finally {
      setIsDownloadingZip(false);
    }
  };

  // Precarga segura de la imagen siguiente y anterior
  useEffect(() => {
    if (currentIndex === null || files.length === 0) return;

    const nextIndex = (currentIndex + 1) % files.length;
    const prevIndex = (currentIndex - 1 + files.length) % files.length;

    // Delayed preload to avoid burst requests to Google Drive
    let nextTimer: number | undefined;
    let prevTimer: number | undefined;

    if (files[nextIndex]?.url) {
      nextTimer = window.setTimeout(() => {
        const img = new Image();
        img.src = getLargeUrl(files[nextIndex]);
      }, 600);
    }

    if (files[prevIndex]?.url) {
      prevTimer = window.setTimeout(() => {
        const img = new Image();
        img.src = getLargeUrl(files[prevIndex]);
      }, 900);
    }

    return () => {
      if (nextTimer) clearTimeout(nextTimer);
      if (prevTimer) clearTimeout(prevTimer);
    };
  }, [currentIndex, files]);

  const handleNext = useCallback(() => {
    setCurrentIndex((prev) => (prev !== null && prev < files.length - 1 ? prev + 1 : 0));
  }, [files.length]);

  const handlePrev = useCallback(() => {
    setCurrentIndex((prev) => (prev !== null && prev > 0 ? prev - 1 : files.length - 1));
  }, [files.length]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (currentIndex === null) return;
      if (e.key === "ArrowRight") handleNext();
      if (e.key === "ArrowLeft") handlePrev();
      if (e.key === "Escape") setCurrentIndex(null);
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [currentIndex, handleNext, handlePrev]);

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.targetTouches[0].clientX;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    touchEndX.current = e.targetTouches[0].clientX;
  };

  const handleTouchEnd = () => {
    const distance = touchStartX.current - touchEndX.current;
    if (distance > 50) handleNext();
    else if (distance < -50) handlePrev();
  };

  return (
    <div className="p-6 max-w-7xl mx-auto text-white">
      {/* Cabecera */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <h1 className="text-2xl font-bold tracking-tight"> {currentFolder.name}</h1>

        {files.length > 0 && (
          <button
            onClick={handleDownloadAlbum}
            disabled={isDownloadingZip}
            className="flex items-center gap-2 bg-zinc-800 hover:bg-zinc-700 disabled:bg-zinc-900 text-zinc-200 border border-zinc-700/60 px-4 py-2 rounded-full text-sm font-medium transition duration-200 shadow-sm self-start sm:self-auto"
          >
            {isDownloadingZip ? (
              <span className="animate-pulse">Comprimiendo ZIP (Originales)...</span>
            ) : (
              <>
                <svg className="w-4 h-4 text-zinc-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                </svg>
                <span>Descargar álbum completo (.zip)</span>
              </>
            )}
          </button>
        )}
      </div>

      {/* Subcarpetas */}
      {currentFolder.folders && currentFolder.folders.length > 0 && (
        <div className="mb-6">
          <h2 className="text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-2">Carpetas</h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {currentFolder.folders.map((folder) => {
              const subCoverFile = folder.files?.[0];
              return (
                <button
                  key={folder.id}
                  onClick={() => setCurrentFolder(folder)}
                  className="group relative bg-zinc-900 border border-zinc-800/80 rounded-xl overflow-hidden text-left hover:border-zinc-700 transition duration-200 flex flex-col"
                >
                  <div className="w-full h-32 bg-zinc-950 overflow-hidden relative">
                    {subCoverFile ? (
                      <LazyImage
                        src={getThumbnailUrl(subCoverFile)}
                        alt={folder.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition duration-500 ease-out"
                        rootMargin="300px"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-zinc-600 text-xs">Vacío</div>
                    )}
                  </div>
                  <div className="p-3">
                    <p className="font-medium text-sm text-zinc-200 truncate">📁 {folder.name}</p>
                    <span className="text-xs text-zinc-500">{folder.files?.length || 0} archivos</span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Grilla de Imágenes */}
      <div>
        <h2 className="text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-2">Imágenes</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {files.map((file, index) => (
            <div
              key={file.id}
              onClick={() => setCurrentIndex(index)}
              className="group relative bg-zinc-900 border border-zinc-800/80 rounded-xl overflow-hidden cursor-pointer aspect-square"
            >
              <LazyImage
                src={getThumbnailUrl(file)}
                alt={file.name}
                className="w-full h-full object-cover group-hover:scale-105 transition duration-500 ease-out"
                rootMargin="300px"
              />
              <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent p-3 text-xs text-zinc-300 truncate">
                {file.name}
              </div>

              <button
                onClick={(e) => handleDownloadSingle(file, e)}
                title="Descargar tamaño original"
                className="absolute top-3 right-3 bg-black/40 hover:bg-black/70 backdrop-blur-md text-white p-2 rounded-full opacity-0 group-hover:opacity-100 scale-90 group-hover:scale-100 transition-all duration-200 shadow-lg border border-white/10"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                </svg>
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* --- VISOR EN GRANDE --- */}
      {activeFile && (
        <div 
          className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center p-2 sm:p-4 backdrop-blur-lg select-none"
          onClick={() => setCurrentIndex(null)}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
        >
          <div 
            className="relative w-full h-full flex flex-col items-center justify-center"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="absolute top-4 right-4 z-50 flex items-center gap-2">
              <button
                onClick={() => handleDownloadSingle(activeFile)}
                title="Descargar tamaño original"
                className="flex items-center gap-2 bg-zinc-900/60 hover:bg-zinc-800/80 backdrop-blur-md text-zinc-200 hover:text-white px-3.5 py-2 rounded-full text-xs font-medium border border-white/10 transition-all duration-200 shadow-lg"
              >
                <svg className="w-4 h-4 text-zinc-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                </svg>
                <span className="hidden sm:inline">Descargar original</span>
              </button>

              <button
                onClick={() => setCurrentIndex(null)}
                className="bg-zinc-900/60 hover:bg-zinc-800/80 backdrop-blur-md text-zinc-400 hover:text-white w-9 h-9 rounded-full flex items-center justify-center border border-white/10 transition-all duration-200 shadow-lg"
              >
                ✕
              </button>
            </div>

            <button
              onClick={handlePrev}
              className="absolute left-3 sm:left-6 z-40 bg-zinc-900/40 hover:bg-zinc-800/70 backdrop-blur-md text-white p-3 rounded-full border border-white/5 transition duration-200"
            >
              ❮
            </button>

            <div className="flex-1 flex items-center justify-center max-w-5xl max-h-[80vh] w-full">
              <LazyImage
                key={activeFile.id}
                src={getLargeUrl(activeFile)}
                alt={activeFile.name}
                className="max-w-full max-h-[75vh] object-contain rounded-lg shadow-2xl transition-opacity duration-200"
                rootMargin="400px"
              />
            </div>

            <button
              onClick={handleNext}
              className="absolute right-3 sm:right-6 z-40 bg-zinc-900/40 hover:bg-zinc-800/70 backdrop-blur-md text-white p-3 rounded-full border border-white/5 transition duration-200"
            >
              ❯
            </button>

            <div className="mt-3 text-center">
              <p className="text-sm font-medium text-zinc-200">{activeFile.name}</p>
              <span className="text-xs text-zinc-500">
                {currentIndex! + 1} de {files.length} • {((activeFile.size ?? 0) / (1024 * 1024)).toFixed(2)} MB
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
