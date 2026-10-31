import { useEffect, useState } from 'react';
import { getGoogleReviews } from '../api';
import SiteTicker from '../components/SiteTicker';
import Navbar from '../components/Navbar';
import Hero from '../components/Hero';
import Branches from '../components/Branches';
import Services from '../components/Services';
import Booking from '../components/Booking';
import Reviews from '../components/Reviews';
import Footer from '../components/Footer';
import Dentists from '../components/Dentists';
import Faq from '../components/Faq';

export default function Home({ isDark, onToggleTheme }) {
  const [branch, setBranch] = useState('Qasimabad'); // shared: navbar, branch cards and booking form stay in sync
  const [googleReviews, setGoogleReviews] = useState({ configured: false, branches: [], error: '' });
  useEffect(() => {
    getGoogleReviews()
      .then((data) => setGoogleReviews({ ...data, error: '' }))
      .catch((error) => setGoogleReviews({ configured: false, branches: [], error: error.message }));
  }, []);
  return (
    <>
      <SiteTicker />
      <Navbar branch={branch} setBranch={setBranch} isDark={isDark} onToggleTheme={onToggleTheme} />
      <main>
        <Hero />
        <Branches branch={branch} setBranch={setBranch} googleReviews={googleReviews} />
        <Services />
        <Dentists />
        <Booking branch={branch} setBranch={setBranch} />
        <Reviews />
        <Faq />
      </main>
      <Footer />
    </>
  );
}
