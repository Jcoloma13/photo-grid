import type { Image } from "@/types/image";

const API_URL = "https://picsum.photos/v2/list";

interface ImageFetchParams {
  page?: number;
  limit?: number;
  signal?: AbortSignal;
}

export async function fetchImages({
  page = 1,
  limit = 20,
  signal,
}: ImageFetchParams): Promise<Image[]> {
  const response = await fetch(`${API_URL}?page=${page}&limit=${limit}`, {
    signal,
  });

  if (!response.ok) {
    throw new Error("No se pudieron cargar las imágenes.");
  }

  const data: Image[] = await response.json();

  return data;
}
