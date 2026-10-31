import { Clock3, MessageCircle } from 'lucide-react';

const items = [
  { id: 'name', content: <b>Dr. Munesh Kumar &amp; Associates Dental Care</b> },
  { id: 'hours', content: <><Clock3 size={16} aria-hidden="true" />Qasimabad (HYD): Mon–Thu, Sat 02 PM–11 PM; Fri &amp; Sun 01 PM–11 PM</> },
  { id: 'mithi-hours', content: <><Clock3 size={16} aria-hidden="true" />Mithi: Mon–Thu 02 PM–11 PM; Fri–Sun 01 PM–11 PM</> },
  {
    id: 'whatsapp',
    content: (
      <a href="https://wa.me/923483233370" target="_blank" rel="noreferrer">
        <MessageCircle size={16} aria-hidden="true" />WhatsApp: +92 348 3233370
      </a>
    ),
  },
];

function TickerGroup({ duplicate = false }) {
  return (
    <div className="ticker-group" aria-hidden={duplicate || undefined}>
      {items.map((item, index) => (
        <span className="ticker-item" key={item.id}>
          {index > 0 && <span className="ticker-separator" aria-hidden="true">•</span>}
          {item.content}
        </span>
      ))}
    </div>
  );
}

export default function SiteTicker() {
  return (
    <aside className="site-ticker" aria-label="Clinic information">
      <div className="ticker-viewport">
        <div className="ticker-track">
          <TickerGroup />
          <TickerGroup duplicate />
        </div>
      </div>
    </aside>
  );
}
