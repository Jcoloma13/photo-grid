import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import Loader from "../components/Loader";

describe("Loader", () => {
  it("renderiza el componente Loader", () => {
    render(<Loader />);
    expect(screen.getByText("Cargando imágenes...")).toBeInTheDocument();
  });

  it("tiene el atributo role status para accesibilidad", () => {
    const { container } = render(<Loader />);
    expect(container.querySelector('[role="status"]')).toBeInTheDocument();
  });

  it("tiene aria-live polite para anuncios accesibles", () => {
    const { container } = render(<Loader />);
    expect(container.querySelector('[aria-live="polite"]')).toBeInTheDocument();
  });

  it("renderiza el spinner", () => {
    const { container } = render(<Loader />);
    expect(container.querySelector(".loader__spinner")).toBeInTheDocument();
  });
});
