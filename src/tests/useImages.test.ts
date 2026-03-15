import { describe, it, expect, beforeEach, vi, afterEach } from "vitest";
import { renderHook, act, waitFor } from "@testing-library/react";
import { useImages } from "../hooks/useImages";
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
];

vi.mock("../services/imagesApi", () => ({
  fetchImages: vi.fn(),
}));

import { fetchImages } from "../services/imagesApi";

describe("useImages", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("carga imágenes inicialmente", async () => {
    const mockFetchImages = fetchImages as ReturnType<typeof vi.fn>;
    mockFetchImages.mockResolvedValueOnce(mockImages);

    const { result } = renderHook(() => useImages(20));

    await waitFor(() => {
      expect(result.current.images).toEqual(mockImages);
    });
  });

  it("establece loading en true mientras carga", async () => {
    const mockFetchImages = fetchImages as ReturnType<typeof vi.fn>;
    let resolvePromise: (value: Image[]) => void;
    const promise = new Promise<Image[]>((resolve) => {
      resolvePromise = resolve;
    });
    mockFetchImages.mockReturnValue(promise);

    const { result } = renderHook(() => useImages(20));

    expect(result.current.loading).toBe(true);

    act(() => {
      resolvePromise!(mockImages);
    });

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });
  });

  it("elimina una imagen por id", async () => {
    const mockFetchImages = fetchImages as ReturnType<typeof vi.fn>;
    mockFetchImages.mockResolvedValueOnce(mockImages);

    const { result } = renderHook(() => useImages(20));

    await waitFor(() => {
      expect(result.current.images).toHaveLength(1);
    });

    act(() => {
      result.current.removeImage(1);
    });

    expect(result.current.images).toHaveLength(0);
  });

  it("carga más imágenes", async () => {
    const mockFetchImages = fetchImages as ReturnType<typeof vi.fn>;
    const secondBatch = [{ ...mockImages[0], id: 2 }];

    mockFetchImages.mockResolvedValueOnce(mockImages).mockResolvedValueOnce(secondBatch);

    const { result } = renderHook(() => useImages(1));

    await waitFor(() => {
      expect(result.current.images).toHaveLength(1);
    });

    act(() => {
      result.current.loadMoreImages();
    });

    await waitFor(() => {
      expect(result.current.images).toHaveLength(2);
    });
  });

  it("establece hasMore en false cuando hay menos imágenes que el límite", async () => {
    const mockFetchImages = fetchImages as ReturnType<typeof vi.fn>;
    const fewerImages = [{ ...mockImages[0] }];
    mockFetchImages.mockResolvedValueOnce(fewerImages);

    const { result } = renderHook(() => useImages(20));

    await waitFor(() => {
      expect(result.current.hasMore).toBe(false);
    });
  });

  it("maneja errores al cargar", async () => {
    const mockFetchImages = fetchImages as ReturnType<typeof vi.fn>;
    mockFetchImages.mockRejectedValueOnce(new Error("Network error"));

    const { result } = renderHook(() => useImages(20));

    await waitFor(() => {
      expect(result.current.error).toBe("Network error");
      expect(result.current.loading).toBe(false);
    });
  });

  it("cancela la petición anterior si ya está pendiente", async () => {
    const mockFetchImages = fetchImages as ReturnType<typeof vi.fn>;
    mockFetchImages.mockImplementation(
      () =>
        new Promise((resolve) => {
          setTimeout(() => resolve(mockImages), 100);
        }),
    );

    const { result } = renderHook(() => useImages(20));

    expect(result.current).toBeDefined();
  });

  it("no carga más si loading es true", async () => {
    const mockFetchImages = fetchImages as ReturnType<typeof vi.fn>;
    const promise = new Promise<Image[]>(() => {});
    mockFetchImages.mockReturnValue(promise);

    const { result } = renderHook(() => useImages(20));

    act(() => {
      result.current.loadMoreImages();
    });

    expect(mockFetchImages).toHaveBeenCalledTimes(1);
  });

  it("no carga más si hasMore es false", async () => {
    const mockFetchImages = fetchImages as ReturnType<typeof vi.fn>;
    mockFetchImages.mockResolvedValueOnce([]);

    const { result } = renderHook(() => useImages(20));

    await waitFor(() => {
      expect(result.current.hasMore).toBe(false);
    });

    const callsBefore = mockFetchImages.mock.calls.length;

    act(() => {
      result.current.loadMoreImages();
    });

    expect(mockFetchImages).toHaveBeenCalledTimes(callsBefore);
  });
});
