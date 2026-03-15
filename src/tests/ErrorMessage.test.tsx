import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import ErrorMessage from "../components/ErrorMessage";

describe("ErrorMessage", () => {
  it("renderiza el mensaje de error correctamente", () => {
    const mockRetry = vi.fn();
    render(<ErrorMessage message="Error al cargar" onRetry={mockRetry} />);

    expect(screen.getByText("Error al cargar")).toBeInTheDocument();
  });

  it("renderiza el botón de reintento", () => {
    const mockRetry = vi.fn();
    render(<ErrorMessage message="Error" onRetry={mockRetry} />);

    expect(screen.getByRole("button", { name: /reintentar/i })).toBeInTheDocument();
  });

  it("llama a onRetry cuando se hace clic en el botón", async () => {
    const user = userEvent.setup();
    const mockRetry = vi.fn();
    render(<ErrorMessage message="Error" onRetry={mockRetry} />);

    const button = screen.getByRole("button", { name: /reintentar/i });
    await user.click(button);

    expect(mockRetry).toHaveBeenCalledOnce();
  });

  it("tiene el atributo role alert para accesibilidad", () => {
    const mockRetry = vi.fn();
    const { container } = render(<ErrorMessage message="Error" onRetry={mockRetry} />);

    expect(container.querySelector('[role="alert"]')).toBeInTheDocument();
  });
});
