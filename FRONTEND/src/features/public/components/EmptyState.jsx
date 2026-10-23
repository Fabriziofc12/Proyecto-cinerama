import { SearchX } from 'lucide-react';
export default function EmptyState({ title = 'No encontramos resultados', children, action }) {
  return (
    <div className="pub-empty" role="status">
      <SearchX size={32} />
      <h2>{title}</h2>
      <p>{children}</p>
      {action}
    </div>
  );
}
