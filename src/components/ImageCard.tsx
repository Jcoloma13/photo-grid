import type { Image } from "@/types/image";
import { useFocusNavigation } from "@/hooks/useFocusNavigation";
import { useState } from "react";

interface ImageCardProps {
  image: Image;
  onRemove: (id: number) => void;
  autoFocus?: boolean;
}

function ImageCard({ image, onRemove, autoFocus = false }: ImageCardProps) {
  const [isRemoving, setIsRemoving] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const { moveFocus } = useFocusNavigation();

  const handleRemove = () => {
    if (isRemoving) return;
    setIsRemoving(true);

    const current = document.activeElement as HTMLElement;

    onRemove(image.id);
    moveFocus(current, ".image-grid", ".image-card__button", 1);
  };

  return (
    <article role="gridcell" className={`image-card ${isRemoving ? "image-card--removing" : ""}`}>
      <button
        type="button"
        className="image-card__button"
        onClick={handleRemove}
        aria-label={`Eliminar imagen de ${image.author}`}
        disabled={isRemoving}
        tabIndex={autoFocus ? 0 : -1}
      >
        {!isLoaded && <div className="image-card__placeholder" data-testid="image-placeholder" />}
        <img
          className={`image-card__image ${isLoaded ? "image-card__image--loaded" : ""}`}
          src={image.download_url}
          alt={image.author}
          onLoad={() => setIsLoaded(true)}
          style={{ opacity: isLoaded ? 1 : 0 }}
          loading="lazy"
        />
        <span className="image-card__overlay" aria-hidden="true">
          Eliminar
        </span>
      </button>
    </article>
  );
}

export default ImageCard;
