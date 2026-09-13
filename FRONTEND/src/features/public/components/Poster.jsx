import { useState } from 'react';
import { Film } from 'lucide-react';

export default function Poster({ src, title, className = '' }) {
  const [failed, setFailed] = useState(false);
  const [loaded, setLoaded] = useState(false);

  if (failed || !src) {
    return (
      <div className={`pub-image-fallback is-loaded ${className}`} role="img" aria-label={title}>
        <Film size={36} />
        <span>{title}</span>
      </div>
    );
  }

  return (
    <>
      <div className={`pub-poster-loading ${loaded ? 'is-loaded' : ''}`} aria-hidden="true" />
      <img
        className={`${className} ${loaded ? 'is-loaded' : ''}`}
        src={src}
        alt={title}
        loading="lazy"
        onLoad={() => setLoaded(true)}
        onError={() => setFailed(true)}
      />
    </>
  );
}
