import { useRef } from "react";
import type { Image } from "@/types/image";
import { useFocusNavigation } from "@/hooks/useFocusNavigation";
import ImageCard from "./ImageCard";

interface ImageGridProps {
  images: Image[];
  onRemove: (id: number) => void;
}

function getGridColumns(grid: HTMLElement): number {
  return window.getComputedStyle(grid).gridTemplateColumns.split(" ").length;
}

function ImageGrid({ images, onRemove }: ImageGridProps) {
  const gridRef = useRef<HTMLElement>(null);
  const { moveFocus } = useFocusNavigation();

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!["ArrowRight", "ArrowLeft", "ArrowDown", "ArrowUp"].includes(e.key)) return;

    e.preventDefault();

    const current = document.activeElement as HTMLElement;
    if (!current) return;

    const columns = getGridColumns(gridRef.current!);
    const deltas = {
      ArrowRight: 1,
      ArrowLeft: -1,
      ArrowDown: columns,
      ArrowUp: -columns,
    } as const;

    moveFocus(current, ".image-grid", ".image-card__button", deltas[e.key as keyof typeof deltas]);
  };

  if (!images.length) return null;

  return (
    <section
      ref={gridRef}
      className="image-grid"
      role="grid"
      aria-label="Galería de imágenes"
      onKeyDown={handleKeyDown}
    >
      {images.map((image, index) => (
        <ImageCard key={image.id} image={image} onRemove={onRemove} autoFocus={index === 0} />
      ))}
    </section>
  );
}

export default ImageGrid;
