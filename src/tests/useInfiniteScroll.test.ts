import { describe, it, expect, beforeEach, vi, afterEach } from "vitest";
import { renderHook, act } from "@testing-library/react";
import { createRef } from "react";
import { useInfiniteScroll } from "../hooks/useInfiniteScroll";

interface MockObserverInstance {
  observe: ReturnType<typeof vi.fn>;
  disconnect: ReturnType<typeof vi.fn>;
  unobserve: ReturnType<typeof vi.fn>;
}

describe("useInfiniteScroll", () => {
  let observeCallback: IntersectionObserverCallback;
  let mockObserverInstance: MockObserverInstance;

  beforeEach(() => {
    observeCallback = vi.fn();

    mockObserverInstance = {
      observe: vi.fn(),
      disconnect: vi.fn(),
      unobserve: vi.fn(),
    };

    global.IntersectionObserver = vi.fn((callback: IntersectionObserverCallback) => {
      observeCallback = callback;
      return mockObserverInstance;
    }) as unknown as typeof IntersectionObserver;
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it("crea un IntersectionObserver cuando está habilitado", () => {
    const ref = createRef<HTMLDivElement>();
    ref.current = document.createElement("div");
    const onIntersect = vi.fn();

    renderHook(() => useInfiniteScroll({ targetRef: ref, onIntersect, enabled: true }));

    expect(global.IntersectionObserver).toHaveBeenCalled();
  });

  it("no crea un IntersectionObserver cuando está deshabilitado", () => {
    const ref = createRef<HTMLDivElement>();
    ref.current = document.createElement("div");
    const onIntersect = vi.fn();

    renderHook(() => useInfiniteScroll({ targetRef: ref, onIntersect, enabled: false }));

    expect(global.IntersectionObserver).not.toHaveBeenCalled();
  });

  it("llama a onIntersect cuando el elemento es visible", () => {
    const ref = createRef<HTMLDivElement>();
    ref.current = document.createElement("div");
    const onIntersect = vi.fn();

    renderHook(() => useInfiniteScroll({ targetRef: ref, onIntersect, enabled: true }));

    const entries: Partial<IntersectionObserverEntry>[] = [
      {
        isIntersecting: true,
        target: ref.current as Element,
      },
    ];

    act(() => {
      observeCallback(entries as IntersectionObserverEntry[], mockObserverInstance as unknown as IntersectionObserver);
    });

    expect(onIntersect).toHaveBeenCalled();
  });

  it("no llama a onIntersect si no está intersecting", () => {
    const ref = createRef<HTMLDivElement>();
    ref.current = document.createElement("div");
    const onIntersect = vi.fn();

    renderHook(() => useInfiniteScroll({ targetRef: ref, onIntersect, enabled: true }));

    const entries: Partial<IntersectionObserverEntry>[] = [
      {
        isIntersecting: false,
        target: ref.current as Element,
      },
    ];

    act(() => {
      observeCallback(
        entries as IntersectionObserverEntry[],
        mockObserverInstance as unknown as IntersectionObserver
      );
    });

    expect(onIntersect).not.toHaveBeenCalled();
  });

  it("no llama a onIntersect si está deshabilitado", () => {
    const ref = createRef<HTMLDivElement>();
    ref.current = document.createElement("div");
    const onIntersect = vi.fn();

    renderHook(() => useInfiniteScroll({ targetRef: ref, onIntersect, enabled: false }));

    expect(onIntersect).not.toHaveBeenCalled();
  });

  it("reestablece el trigger después de 1 segundo", async () => {
    vi.useFakeTimers();

    const ref = createRef<HTMLDivElement>();
    ref.current = document.createElement("div");
    const onIntersect = vi.fn();

    renderHook(() => useInfiniteScroll({ targetRef: ref, onIntersect, enabled: true }));

    const entries: Partial<IntersectionObserverEntry>[] = [
      {
        isIntersecting: true,
        target: ref.current as Element,
      },
    ];

    act(() => {
      observeCallback(
        entries as IntersectionObserverEntry[],
        mockObserverInstance as unknown as IntersectionObserver
      );
    });

    expect(onIntersect).toHaveBeenCalledTimes(1);

    // Simular otra intersección mientras está enabled
    act(() => {
      observeCallback(
        entries as IntersectionObserverEntry[],
        mockObserverInstance as unknown as IntersectionObserver
      );
    });

    // Debe llamarse en cada intersección ahora que enabled controla el flujo
    expect(onIntersect).toHaveBeenCalledTimes(2);

    vi.useRealTimers();
  });

  it("usa valores por defecto", () => {
    const ref = createRef<HTMLDivElement>();
    ref.current = document.createElement("div");
    const onIntersect = vi.fn();

    renderHook(() => useInfiniteScroll({ targetRef: ref, onIntersect }));

    expect(global.IntersectionObserver).toHaveBeenCalled();
  });

  it("desconecta el observer al desmontar", () => {
    const ref = createRef<HTMLDivElement>();
    ref.current = document.createElement("div");
    const onIntersect = vi.fn();

    const { unmount } = renderHook(() =>
      useInfiniteScroll({ targetRef: ref, onIntersect, enabled: true }),
    );

    unmount();

    expect(mockObserverInstance.disconnect).toHaveBeenCalled();
  });
});
