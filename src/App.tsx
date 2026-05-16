import { useEffect, useState } from 'react';
import { Header } from '@/sections/Header';
import { Hero } from '@/sections/Hero';
import { Servicos } from '@/sections/Servicos';
import { Sobre } from '@/sections/Sobre';
import { Depoimentos } from './sections/Depoimentos';
import { Contato } from '@/sections/Contato';
import { Footer } from '@/sections/Footer';
import { WhatsAppButton } from '@/components/WhatsAppButton';

function App() {
  const [showFloating, setShowFloating] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setShowFloating(window.scrollY > 100);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="min-h-screen bg-white">
      <Header />
      <main>
        <Hero />
        <Servicos />
        <Sobre />
        <Depoimentos />
        <Contato />
      </main>
      <Footer />
      {showFloating && <WhatsAppButton variant="floating" />}
    </div>
  );
}

export default App;
