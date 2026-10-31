import { Star } from 'lucide-react';
export default function Stars({ n = 5, size = 16 }) {
  return <span className="inline-flex" aria-label={`${n} out of 5 stars`}>{Array.from({ length: n }, (_, i) => <Star key={i} size={size} className="fill-gold text-gold" />)}</span>;
}