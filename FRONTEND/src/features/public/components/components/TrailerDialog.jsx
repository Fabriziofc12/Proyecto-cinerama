import { useEffect, useRef, useState } from 'react';
import { ExternalLink, Play, X } from 'lucide-react';

export default function TrailerDialog({ movie, onClose }) {
  const ref = useRef(null);
  const [playing, setPlaying] = useState(false);
  const [thumbnailFailed, setThumbnailFailed] = useState(false);
  useEffect(() => {
    const dialog = ref.current;
    dialog.showModal();
    return () => dialog.close();
  }, []);
  return (
    <dialog
      className="pub-dialog"
      aria-labelledby="pub-trailer-title"
      ref={ref}
      onCancel={onClose}
      onClick={(event) => {
        if (event.target === ref.current) onClose();
      }}
    >
      <div className="pub-section-heading">
        <h2 id="pub-trailer-title">Tráiler · {movie.title}</h2>
        <button className="pub-icon-button" autoFocus aria-label="Cerrar tráiler" onClick={onClose}>
          <X />
        </button>
      </div>
      {movie.trailerUrl ? (
        <>
          <div className="pub-trailer-player">
            {playing ? (
              <iframe
                src={`${movie.trailerUrl}?autoplay=1`}
                title={`Tráiler de ${movie.title}`}
                referrerPolicy="strict-origin-when-cross-origin"
                allow="autoplay; encrypted-media; picture-in-picture"
                allowFullScreen
              />
            ) : (
              <button
                className="pub-trailer-preview"
                onClick={() => setPlaying(true)}
                aria-label={`Reproducir tráiler de ${movie.title}`}
              >
                {!thumbnailFailed && (
                  <img
                    src={`https://i.ytimg.com/vi/${movie.trailerId}/hqdefault.jpg`}
                    alt=""
                    onError={() => setThumbnailFailed(true)}
                  />
                )}
                <span>
                  <Play size={30} fill="currentColor" />
                  <strong>Reproducir tráiler</strong>
                  <small>{movie.title}</small>
                </span>
              </button>
            )}
          </div>
          <p>Si el reproductor no carga, abre el video en YouTube.</p>
          <a
            className="pub-text-link"
            href={`https://www.youtube.com/watch?v=${movie.trailerId}`}
            target="_blank"
            rel="noreferrer"
          >
            Ver en YouTube <ExternalLink size={16} />
          </a>
        </>
      ) : (
        <p>El tráiler estará disponible próximamente.</p>
      )}
    </dialog>
  );
}
