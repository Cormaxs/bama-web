import galleryData from "@/galeria.json";

export const REMOTE_GALLERY_URL =
  "https://raw.githubusercontent.com/Cormaxs/bama-web/main/galeria.json";

export type GalleryFile = {
  id: string;
  name: string;
  mimeType: string;
  url: string;
  size: number;
  createdTime: string;
};

export type GalleryFolder = {
  id: string;
  name: string;
  folders: GalleryFolder[];
  files: GalleryFile[];
};

export type GalleryRoot = {
  id: string;
  name: string;
  folders: GalleryFolder[];
  files: GalleryFile[];
};

export const galleryRoot: GalleryRoot = galleryData as GalleryRoot;

export function normalizeSlug(value: string): string {
  const accentMap: Record<string, string> = {
    á: "a",
    à: "a",
    ä: "a",
    é: "e",
    è: "e",
    ë: "e",
    í: "i",
    ì: "i",
    ï: "i",
    ó: "o",
    ò: "o",
    ö: "o",
    ú: "u",
    ù: "u",
    ü: "u",
    ñ: "n",
    ç: "c",
  };

  const normalized = value
    .trim()
    .toLowerCase()
    .replace(/[áàäéèëíìïóòöúùüñç]/g, (char) => accentMap[char] || char)
    .replace(/&/g, "and")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

  return normalized || "gallery";
}

export function buildImageUrl(originalUrl: string, size: number): string {
  if (!originalUrl) return originalUrl;

  const cleaned = originalUrl.replace(/=s\d+$/i, "");

  return `${cleaned}=s${size}`;
}

export async function getGalleryData(): Promise<GalleryRoot> {
  try {
    const response = await fetch(REMOTE_GALLERY_URL, {
      cache: "no-store",
    });

    if (!response.ok) {
      throw new Error(`Unable to fetch gallery data: ${response.status}`);
    }

    const data = (await response.json()) as GalleryRoot;
    if (data && Array.isArray(data.files)) {
      return data;
    }

    return galleryRoot;
  } catch {
    return galleryRoot;
  }
}

export function listFolderFiles(folder: GalleryFolder | GalleryRoot): GalleryFile[] {
  return [...folder.files, ...folder.folders.flatMap(listFolderFiles)];
}

export function getAllGalleryImages(root: GalleryRoot = galleryRoot): GalleryFile[] {
  return [...root.files, ...root.folders.flatMap((folder) => listFolderFiles(folder))];
}

export function getGalleryCollections(root: GalleryRoot = galleryRoot): Array<{
  slug: string;
  name: string;
  files: GalleryFile[];
  folderCount: number;
}> {
  const walk = (
    folder: GalleryFolder | GalleryRoot,
  ): Array<{ slug: string; name: string; files: GalleryFile[]; folderCount: number }> => {
    const folders = folder.folders.map((child) => walk(child)).flat();
    const files = listFolderFiles(folder);

    if (folder === root) {
      return folders;
    }

    return [
      {
        slug: normalizeSlug(folder.name),
        name: folder.name,
        files,
        folderCount: folder.folders.length,
      },
      ...folders,
    ];
  };

  return walk(root);
}

export function findFolderBySlug(
  slug: string,
  root: GalleryRoot = galleryRoot,
): GalleryFolder | GalleryRoot | null {
  const walk = (folder: GalleryFolder | GalleryRoot): GalleryFolder | GalleryRoot | null => {
    if (normalizeSlug(folder.name) === slug) return folder;

    for (const child of folder.folders) {
      const match = walk(child);
      if (match) return match;
    }

    return null;
  };

  return walk(root);
}

export function getAllFolderSlugs(root: GalleryRoot = galleryRoot): string[] {
  const slugs: string[] = [];

  const walk = (folder: GalleryFolder | GalleryRoot) => {
    const slug = normalizeSlug(folder.name);
    if (slug && slug !== "imagen") {
      slugs.push(slug);
    }
    for (const child of folder.folders) walk(child);
  };

  walk(root);
  return slugs;
}
