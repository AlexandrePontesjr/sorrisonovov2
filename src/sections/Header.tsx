import { useState, useEffect } from 'react';
import { Menu, X } from 'lucide-react';
import { WhatsAppButton } from '@/components/WhatsAppButton';
import { SocialLinks } from '@/components/SocialLinks';

const navLinks = [
  { label: 'Início', href: '#hero' },
  { label: 'Serviços', href: '#servicos' },
  { label: 'Sobre', href: '#sobre' },
  { label: 'Depoimentos', href: '#depoimentos' },
  { label: 'Contato', href: '#contato' },
];

export function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleNavClick = (href: string) => {
    setMobileOpen(false);
    const element = document.querySelector(href);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-40 h-[72px] transition-all duration-300 ${scrolled
        ? 'bg-white/90 backdrop-blur-xl shadow-nav border-b border-slate-100'
        : 'bg-white/80 backdrop-blur-md border-b border-transparent'
        }`}
    >
      <div className="max-w-[1200px] mx-auto h-full px-6 lg:px-8 flex items-center justify-between">
        {/* Logo */}
        <a
          href="#hero"
          onClick={(e) => {
            e.preventDefault();
            handleNavClick('#hero');
          }}
          className="flex items-center gap-2"
        >
          <img src="/logo.png" alt="Logo da clínica Sorriso Novo" className="h-10 w-18" />
          {/* <svg width="28" height="28" viewBox="0 0 24 24" fill="none" className="text-coral">
            <path
              d="M12 2C8.5 2 6 4.5 6 7c0 1.5.5 2.5 1 3.5.5 1 1 2 1 3.5 0 2.5 1.5 4 2 5 .5 1 1.5 3 2 3s1.5-2 2-3c.5-1 2-2.5 2-5 0-1.5.5-2.5 1-3.5.5-1 1-2 1-3.5 0-2.5-2.5-5-6-5zm-2 5c-.5 0-1-.5-1-1s.5-1 1-1 1 .5 1 1-.5 1-1 1zm4 0c-.5 0-1-.5-1-1s.5-1 1-1 1 .5 1 1-.5 1-1 1z"
              fill="currentColor"
            />
          </svg> */}
          <span className="font-playfair text-2xl font-bold leading-none">
            <span className="text-coral">SORRISO</span>{' '}
            <span className="text-yellow-brand">NOVO</span>
          </span>
        </a>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              onClick={(e) => {
                e.preventDefault();
                handleNavClick(link.href);
              }}
              className="font-inter text-sm font-medium text-dark-light hover:text-coral transition-colors duration-200"
            >
              {link.label}
            </a>
          ))}
        </nav>

        {/* Desktop CTA */}
        <div className="hidden md:flex items-center gap-3">
          <SocialLinks />
          <WhatsAppButton className="text-sm py-2.5 px-5">
            Agendar
          </WhatsAppButton>
        </div>

        {/* Mobile Hamburger */}
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="md:hidden p-2 text-dark"
          aria-label="Menu"
        >
          {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile Menu */}
      {mobileOpen && (
        <div className="md:hidden fixed inset-0 top-[72px] z-50">
          <div
            className="absolute inset-0 bg-black/30"
            onClick={() => setMobileOpen(false)}
          />
          <div className="absolute right-0 top-0 w-[280px] h-[calc(100vh-72px)] bg-white shadow-xl p-6 flex flex-col gap-4">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={(e) => {
                  e.preventDefault();
                  handleNavClick(link.href);
                }}
                className="font-inter text-lg font-medium text-dark-light hover:text-coral transition-colors py-2"
              >
                {link.label}
              </a>
            ))}
            <div className="mt-auto pt-6 border-t border-slate-100">
              <SocialLinks className="mb-4 justify-center" linkClassName="h-10 w-10" />
              <WhatsAppButton className="w-full justify-center">
                Agendar
              </WhatsAppButton>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
