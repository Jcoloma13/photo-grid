import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import ImageCard from "../components/ImageCard";
import type { Image } from "../types/image";

const mockImage: Image = {
  id: 1,
  author: "Test Author",
  download_url: "https://example.com/image.jpg",
  width: 800,
  height: 600,
  url: "https://example.com/photo/1",
};

describe("ImageCard", () => {
  let mockOnRemove: ReturnType<typeof vi.fn>;

  beforeEach(() => {
    mockOnRemove = vi.fn();
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("renderiza la tarjeta de imagen correctamente", () => {
    render(<ImageCard image={mockImage} onRemove={mockOnRemove} />);

    expect(screen.getByAltText(mockImage.author)).toBeInTheDocument();
    expect(screen.getByRole("button")).toBeInTheDocument();
  });

  it("renderiza la imagen con la URL correcta", () => {
    render(<ImageCard image={mockImage} onRemove={mockOnRemove} />);

    const img = screen.getByAltText(mockImage.author) as HTMLImageElement;
    expect(img.src).toContain(mockImage.download_url);
  });

  it("renderiza el botón de eliminar", () => {
    render(<ImageCard image={mockImage} onRemove={mockOnRemove} />);

    expect(screen.getByRole("button")).toBeInTheDocument();
  });

  it("llama a onRemove cuando se hace clic en eliminar", async () => {
    render(<ImageCard image={mockImage} onRemove={mockOnRemove} />);

    const button = screen.getByRole("button");
    fireEvent.click(button);

    vi.advanceTimersByTime(400);
    expect(mockOnRemove).toHaveBeenCalledWith(mockImage.id);
  });

  it("establece autoFocus correctamente", () => {
    const { container } = render(
      <ImageCard image={mockImage} onRemove={mockOnRemove} autoFocus={true} />,
    );

    expect(container.querySelector('[role="gridcell"]')).toBeInTheDocument();
  });

  it("maneja la carga de imagen correctamente", () => {
    render(<ImageCard image={mockImage} onRemove={mockOnRemove} />);

    const img = screen.getByAltText(mockImage.author) as HTMLImageElement;
    fireEvent.load(img);

    expect(img).toBeInTheDocument();
  });
});
