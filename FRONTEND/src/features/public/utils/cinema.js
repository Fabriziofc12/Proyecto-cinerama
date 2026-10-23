export function cinemaMapLinks(cinema) {
  const destination = encodeURIComponent(`${cinema.name}, ${cinema.address}, ${cinema.city}, Perú`);
  return {
    location: `https://www.google.com/maps/search/?api=1&query=${destination}`,
    directions: `https://www.google.com/maps/dir/?api=1&destination=${destination}`,
  };
}
