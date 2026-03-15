function Loader() {
  return (
    <div className="loader" role="status" aria-live="polite">
      <div className="loader__spinner" />
      <span className="loader__text">Cargando imágenes...</span>
    </div>
  );
}

export default Loader;
