
export const BRANCHES = [
  {
    id: 'Qasimabad', city: 'Hyderabad', name: 'Dr. Munesh Kumar & Associates Dental Care Center',
    address: 'Shop # 06, Faraz Centre, Main Wadhu Wah Rd, Qasimabad, Hyderabad, 71000, Pakistan',
    phone: '+92 348 3233370', plus: '98WQ+JR Hyderabad, Pakistan',
    googleUrl: 'https://maps.app.goo.gl/pdrTaQZu8ChGwsZRA',
  },
  {
    id: 'Mithi', city: 'Tharparkar', name: 'Dr. Munesh Kumar & Associates Dental Implant & Facial Surgery Clinic',
    address: 'Naukot - Mithi Road, opp. PPHI Sindh District office, Shahi Bazar, Mithi, Pakistan',
    phone: '+92 348 3233370', /* TODO: replace with Mithi clinic number */ plus: null,
    mapUrl: 'https://maps.app.goo.gl/3yWDgP9KApLV2V8Z6', lat: 24.7352758, lng: 69.7935063,
    googleUrl: 'https://maps.app.goo.gl/FkKCoHvEY1aLYkLk8',
  },
];
export const mapUrl = (b) => b.mapUrl || `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(b.plus || b.address)}`;
export const telUrl = (b) => `tel:${b.phone.replace(/\s/g, '')}`;
export const formatTime = (time) => {
  const [hours, minutes] = time.split(':').map(Number);
  const period = hours >= 12 && hours < 24 ? 'PM' : 'AM';
  const hour = hours === 24 ? 12 : hours % 12 || 12;
  return `${hour}:${String(minutes).padStart(2, '0')} ${period}`;
};
export const SERVICES = [
  {
    name: 'Scaling & Polishing',
    image: '/Scaling_and_polishing.jpg',
    headline: 'Professional Teeth Cleaning',
    description: 'Scaling and polishing performed with the latest equipment, ensuring complete hygiene, sterilization, and patient safety for fresh breath and healthy gums.',
    price: 'PKR 6,000 – 8,000',
  },
  {
    name: 'PFM Crowns & Bridges',
    image: '/bridge_teeth.jpg',
    headline: 'Smile Restoration with Crowns & Bridges',
    description: 'High-quality crowns protect damaged teeth, while bridges replace missing teeth for a complete and beautiful smile.',
    price: 'PKR 8,000 – 12,000',
  },
  {
    name: 'Root Canal Treatment',
    image: '/root_canal.jpg',
    headline: 'Pain Relief & Tooth-Saving Treatment',
    description: 'Root canal treatment helps eliminate infection, stop pain, and restore your tooth for long-term oral health.',
    price: 'PKR 8,000 – 12,000',
  },
  {
    name: 'PFM Crown',
    image: '/Crown.jpg',
    headline: 'Smile Restoration with Crowns',
    description: 'A high-quality crown protects a damaged tooth and helps restore a complete, beautiful smile.',
    price: 'PKR 8,000',
  },
  {
    name: 'Dental Implant',
    image: '/denal_implant.jpg',
    headline: 'Smile Reconstruction with Dental Implants',
    description: 'A modern and reliable solution for replacing missing teeth with natural function and aesthetics.',
    price: 'PKR 70,000 – 80,000',
  },
  {
    name: 'Amalgam Restoration',
    image: '/teeth_amalgam_restoration.jpg',
    headline: 'Silver Restoration',
    description: 'Amalgam filling for cavities. This treatment requires cavity preparation and may affect weakened tooth structure.',
    price: 'PKR 2,000',
  },
  {
    name: 'Zirconia Crowns & Bridges',
    image: '/ZirconiaCrowns&Bridges.jpg',
    headline: 'Best-Quality Zirconia for an Aesthetic Smile',
    description: 'Smile makeovers with zirconium crowns and bridges.',
    price: 'PKR 25,000',
  },
  {
    name: 'Zirconia Crown',
    image: '/Zirconia_Crown.jpg',
    headline: 'High-Quality Zirconium Crown',
    description: 'High-quality zirconium crown work, backed by a guarantee.',
    price: 'PKR 25,000',
  },
  {
    name: 'Cast Partial Denture',
    image: '/Cast_Partial_Denture.jpg',
    headline: 'Custom Cast Partial Denture',
    description: 'Cast partial denture framework with individual teeth priced separately.',
    price: 'PKR 15,000 framework + PKR 2,000 per tooth',
  },
];
export const FEATURED_DENTISTS = [
  {
    _id: 'sample-dentist',
    name: 'Dr. Munesh Kumar',
    photoUrl: '/dr-munesh-kumar.png',
    qualifications: ['BDS', 'RDS', 'MSc', 'OP & Endo', 'LUMHS'],
    specialties: ['General Dentistry', 'Endodontics', 'Dental Implants', 'Orthodontics'],
    bio: 'Consultant Endodontist & Implantologist',
    schedule: [],
  },
];
export const SAMPLE_FAQS = [
  { _id: 'sample-faq-1', question: 'How do I book?', answer: 'Use the booking form, choose a branch and a free time, and we will confirm by phone, email or SMS.' },
  { _id: 'sample-faq-2', question: 'Can I change or cancel my appointment?', answer: 'Yes. Use the link in your confirmation message to reschedule or cancel. Changes close 2 hours before the visit; after that, please call us.' },
  { _id: 'sample-faq-3', question: 'How much does treatment cost?', answer: 'Cost depends on the case. Each service page shows an estimate; the dentist confirms the final price after examination.' },
  { _id: 'sample-faq-4', question: 'How often should I have a check-up?', answer: 'Most people benefit from a check-up and cleaning every six months, or as your dentist advises.' },
];
export const SAMPLE_ARTICLES = [
  {
    _id: 'sample-article-daily-brushing-basics',
    slug: 'daily-brushing-basics',
    title: 'Daily brushing and flossing basics',
    excerpt: 'Small habits that protect your teeth.',
    body: 'Brush twice a day for two minutes with a fluoride toothpaste, and replace your brush about every three months.\n\nClean between your teeth once a day with floss or interdental brushes, since a brush cannot reach those surfaces.\n\nLimit sugary snacks and drinks between meals, and see your dentist if you notice bleeding gums, pain, or sensitivity that does not settle.',
  },
];
export const telHref = telUrl;
