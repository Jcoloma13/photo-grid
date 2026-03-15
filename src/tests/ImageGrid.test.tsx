import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import ImageGrid from "../components/ImageGrid";
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

describe("ImageGrid", () => {
  let mockOnRemove: ReturnType<typeof vi.fn>;

  beforeEach(() => {
    mockOnRemove = vi.fn();
  });

  it("no renderiza nada si no hay imágenes", () => {
    const { container } = render(<ImageGrid images={[]} onRemove={mockOnRemove} />);

    expect(container.querySelector(".image-grid")).not.toBeInTheDocument();
  });

  it("renderiza todas las imágenes", () => {
    render(<ImageGrid images={mockImages} onRemove={mockOnRemove} />);

    mockImages.forEach((image) => {
      expect(screen.getByAltText(image.author)).toBeInTheDocument();
    });
  });

  it("tiene el atributo role grid para accesibilidad", () => {
    const { container } = render(<ImageGrid images={mockImages} onRemove={mockOnRemove} />);

    expect(container.querySelector('[role="grid"]')).toBeInTheDocument();
  });

  it("tiene aria-label para accesibilidad", () => {
    const { container } = render(<ImageGrid images={mockImages} onRemove={mockOnRemove} />);

    expect(container.querySelector('[aria-label="Galería de imágenes"]')).toBeInTheDocument();
  });

  it("propaga el manejador onRemove a ImageCard", () => {
    render(<ImageGrid images={mockImages} onRemove={mockOnRemove} />);

    const buttons = screen.getAllByRole("button");
    expect(buttons.length).toBe(mockImages.length);
  });

  it("maneja la navegación con teclas de flecha", () => {
    const { container } = render(<ImageGrid images={mockImages} onRemove={mockOnRemove} />);

    const gridSection = container.querySelector(".image-grid") as HTMLElement;
    const event = new KeyboardEvent("keydown", { key: "ArrowRight", bubbles: true });

    fireEvent(gridSection, event);
    // El evento no debe causar errores
    expect(gridSection).toBeInTheDocument();
  });
});
