import { useCallback } from "react";

export function useFocusNavigation() {
  const moveFocus = useCallback(
    (
      currentElement: HTMLElement,
      containerSelector: string,
      itemSelector: string,
      delta: number,
    ) => {
      const container = currentElement.closest(containerSelector);
      if (!container) return;

      const items = Array.from(container.querySelectorAll<HTMLElement>(itemSelector));
      const currentIndex = items.indexOf(currentElement);
      if (currentIndex === -1) return;

      const nextIndex = Math.max(0, Math.min(currentIndex + delta, items.length - 1));
      items[nextIndex]?.focus();
    },
    [],
  );

  return { moveFocus };
}
