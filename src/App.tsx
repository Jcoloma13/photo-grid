import { useRef } from "react";
import "@/App.css";
import ErrorMessage from "./components/ErrorMessage";
import ImageGrid from "./components/ImageGrid";
import Loader from "./components/Loader";
import { useInfiniteScroll } from "./hooks/useInfiniteScroll";
import { useImages } from "./hooks/useImages";

function App() {
  const sentinelRef = useRef<HTMLDivElement | null>(null);

  const { images, loading, error, hasMore, loadMoreImages, removeImage } = useImages(20);

  useInfiniteScroll({
    targetRef: sentinelRef,
    onIntersect: loadMoreImages,
    enabled: hasMore && !loading && !error,
  });

  return (
    <main className="app">
      <header className="header">
        <h1>Image Grid</h1>
        <p>Image grid with infinite scroll.</p>
      </header>

      <section className="content">
        {error && <ErrorMessage message={error} onRetry={loadMoreImages} />}

        <ImageGrid images={images} onRemove={removeImage} />

        {loading && <Loader />}

        {!loading && !hasMore && <p className="no-more">No more images to load.</p>}

        <div ref={sentinelRef} className="sentinel" aria-hidden="true" />
      </section>
    </main>
  );
}

export default App;
