import { useState } from 'react';

export default function HeroBackdrop({ movie, fading }) {
  const [failed, setFailed] = useState(false);
  return (
    <div className={`pub-hero-backdrop ${fading ? 'is-fading' : ''}`} aria-hidden="true">
      {movie.backdrop && !failed && (
        <img
          src={movie.backdrop}
          alt=""
          fetchPriority="high"
          decoding="async"
          onError={() => setFailed(true)}
        />
      )}
    </div>
  );
}
