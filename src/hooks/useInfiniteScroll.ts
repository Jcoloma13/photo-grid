import type { RefObject } from "react";
import { useEffect } from "react";

interface UseInfiniteScrollParams {
  targetRef: RefObject<HTMLDivElement | null>;
  onIntersect: () => void;
  enabled?: boolean;
}

export function useInfiniteScroll({
  targetRef,
  onIntersect,
  enabled = true,
}: UseInfiniteScrollParams) {
  useEffect(() => {
    if (!enabled) return;

    const element = targetRef.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting) {
          onIntersect();
        }
      },
      {
        rootMargin: "200px",
        threshold: 0,
      },
    );

    observer.observe(element);
    return () => observer.disconnect();
  }, [targetRef, enabled]);
}
