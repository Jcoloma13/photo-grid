import { describe, it, expect, beforeEach, vi, afterEach } from "vitest";
import { fetchImages } from "../services/imagesApi";
import type { Image } from "../types/image";

const mockImages: Image[] = [
  {
    id: 1,
    author: "Author 1",
    download_url: "https://example.com/1.jpg",
    width: 800,
    height: 600,
    url: "https://example.com/1",
  },
  {
    id: 2,
    author: "Author 2",
    download_url: "https://example.com/2.jpg",
    width: 800,
    height: 600,
    url: "https://example.com/2",
  },
];

describe("imagesApi", () => {
  beforeEach(() => {
    global.fetch = vi.fn();
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it("obtiene imágenes exitosamente", async () => {
    const mockFetch = global.fetch as ReturnType<typeof vi.fn>;
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve(mockImages),
    });

    const result = await fetchImages({ page: 1, limit: 20 });

    expect(result).toEqual(mockImages);
    expect(mockFetch).toHaveBeenCalledWith(
      "https://picsum.photos/v2/list?page=1&limit=20",
      expect.any(Object),
    );
  });

  it("usa valores por defecto de página y límite", async () => {
    const mockFetch = global.fetch as ReturnType<typeof vi.fn>;
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve(mockImages),
    });

    await fetchImages({});

    expect(mockFetch).toHaveBeenCalledWith(
      "https://picsum.photos/v2/list?page=1&limit=20",
      expect.any(Object),
    );
  });

  it("lanza error cuando la respuesta no es ok", async () => {
    const mockFetch = global.fetch as ReturnType<typeof vi.fn>;
    mockFetch.mockResolvedValueOnce({
      ok: false,
      json: () => Promise.resolve([]),
    });

    await expect(fetchImages({ page: 1, limit: 20 })).rejects.toThrow(
      "No se pudieron cargar las imágenes.",
    );
  });

  it("pasa el AbortSignal a fetch", async () => {
    const mockFetch = global.fetch as ReturnType<typeof vi.fn>;
    const mockSignal = {} as AbortSignal;

    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve(mockImages),
    });

    await fetchImages({ page: 1, limit: 20, signal: mockSignal });

    expect(mockFetch).toHaveBeenCalledWith(
      expect.any(String),
      expect.objectContaining({ signal: mockSignal }),
    );
  });

  it("maneja diferentes páginas", async () => {
    const mockFetch = global.fetch as ReturnType<typeof vi.fn>;
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve(mockImages),
    });

    await fetchImages({ page: 5, limit: 30 });

    expect(mockFetch).toHaveBeenCalledWith(
      "https://picsum.photos/v2/list?page=5&limit=30",
      expect.any(Object),
    );
  });
});
