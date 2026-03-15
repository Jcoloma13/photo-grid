import { fetchImages } from "@/services/imagesApi";
import type { Image } from "@/types/image";
import { useEffect, useRef, useState } from "react";

export function useImages(limit = 20) {
  const [images, setImages] = useState<Image[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasMore, setHasMore] = useState(true);

  const pageRef = useRef(1);
  const abortControllerRef = useRef<AbortController | null>(null);

  const loadMoreImages = async () => {
    if (loading || !hasMore) return;

    abortControllerRef.current?.abort();
    const controller = new AbortController();
    abortControllerRef.current = controller;

    setLoading(true);
    setError(null);

    try {
      const newImages = await fetchImages({
        page: pageRef.current,
        limit,
        signal: controller.signal,
      });

      if (controller.signal.aborted) return;

      setImages((prev) => [...prev, ...newImages]);

      if (newImages.length < limit) {
        setHasMore(false);
      } else {
        pageRef.current += 1;
      }
    } catch (err) {
      if (err instanceof Error && err.name !== "AbortError") {
        setError(err.message || "Error loading images");
      }
    } finally {
      if (!controller.signal.aborted) setLoading(false);
    }
  };

  const removeImage = (imageId: number) => {
    setImages((prev) => prev.filter((image) => image.id !== imageId));
  };

  useEffect(() => {
    loadMoreImages();
    return () => abortControllerRef.current?.abort();
  }, []);

  return { images, loading, error, hasMore, loadMoreImages, removeImage };
}
