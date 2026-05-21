import { useEffect, useState } from 'react';
import { CalendarDays, ChevronRight, Menu, X } from 'lucide-react';
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
  const [mobileVisible, setMobileVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? 'hidden' : '';
    document.body.dataset.mobileMenuOpen = mobileOpen ? 'true' : 'false';
    return () => {
      document.body.style.overflow = '';
      delete document.body.dataset.mobileMenuOpen;
    };
  }, [mobileOpen]);

  useEffect(() => {
    if (mobileOpen) {
      setMobileVisible(true);
      return;
    }

    const timeout = window.setTimeout(() => {
      setMobileVisible(false);
    }, 280);

    return () => window.clearTimeout(timeout);
  }, [mobileOpen]);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setMobileOpen(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
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
          <WhatsAppButton intent="schedule" className="text-sm py-2.5 px-5">
            Agendar
          </WhatsAppButton>
        </div>

        {/* Mobile Hamburger */}
        <button
          onClick={() => setMobileOpen((value) => !value)}
          className="md:hidden inline-flex h-11 w-11 items-center justify-center rounded-full border border-slate-200 bg-white/90 text-dark shadow-sm transition-transform active:scale-95"
          aria-label="Menu"
          aria-expanded={mobileOpen}
          aria-controls="mobile-navigation"
        >
          {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile Menu */}
      {mobileVisible && (
        <div
          className={`md:hidden fixed inset-0 top-[72px] z-50 transition-opacity duration-300 ease-out ${mobileOpen ? 'pointer-events-auto opacity-100' : 'pointer-events-none opacity-0'}`}
          aria-hidden={!mobileOpen}
        >
          <div
            className={`absolute inset-0 bg-slate-950/35 backdrop-blur-[2px] transition-opacity duration-300 ease-out ${mobileOpen ? 'opacity-100' : 'opacity-0'}`}
            onClick={() => setMobileOpen(false)}
          />
          <div
            id="mobile-navigation"
            className={`absolute inset-0 flex h-[calc(100vh-72px)] w-full flex-col overflow-hidden bg-white shadow-[0_24px_80px_rgba(15,23,42,0.18)] transition-all duration-300 ease-premium will-change-transform ${mobileOpen ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}`}
          >
            <div className={`flex items-start justify-between border-b border-slate-100 px-6 pb-5 pt-6 transition-all duration-300 ease-premium md:px-8 ${mobileOpen ? 'translate-y-0 opacity-100' : 'translate-y-2 opacity-0'}`}>
              <div>
                <p className="font-inter text-xs font-semibold uppercase tracking-[0.22em] text-coral">
                  Menu
                </p>
                <p className="mt-1 font-playfair text-2xl text-dark">Navegação</p>
              </div>
            </div>

            <nav className="flex-1 px-4 py-5 md:px-8">
              <div className="space-y-2">
                {navLinks.map((link, index) => (
                  <a
                    key={link.href}
                    href={link.href}
                    onClick={(e) => {
                      e.preventDefault();
                      handleNavClick(link.href);
                    }}
                    className={`group flex items-center justify-between rounded-2xl border border-transparent bg-slate-50 px-4 py-4 text-base font-semibold text-dark-light transition-all duration-500 ease-premium hover:-translate-x-0.5 hover:border-coral/20 hover:bg-coral/5 hover:text-dark ${mobileOpen ? 'translate-y-0 opacity-100' : 'translate-y-3 opacity-0'}`}
                    style={{ transitionDelay: mobileOpen ? `${120 + index * 55}ms` : '0ms' }}
                  >
                    <span>{link.label}</span>
                    <ChevronRight className="h-4 w-4 text-coral opacity-70 transition-transform group-hover:translate-x-0.5" />
                  </a>
                ))}
              </div>

              <a
                href="https://clinicasorrisonovo.codental.site/marcar-consulta"
                target="_blank"
                rel="noopener noreferrer"
                className={`mt-6 block rounded-3xl bg-gradient-to-br from-coral/10 via-white to-secondary p-4 ring-1 ring-slate-100 transition-all duration-500 ease-premium hover:-translate-y-0.5 md:max-w-[420px] ${mobileOpen ? 'translate-y-0 opacity-100' : 'translate-y-3 opacity-0'}`}
                style={{ transitionDelay: mobileOpen ? '430ms' : '0ms' }}
              >
                <div className="flex items-start gap-3">
                  <div className="mt-0.5 rounded-2xl bg-[#FEE4E2] p-3 text-[#FF6B5C]">
                    <CalendarDays className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="font-inter text-sm font-semibold text-dark">Agende com facilidade</p>
                    <p className="mt-1 font-inter text-sm leading-6 text-dark-light">
                      Escolha o melhor horário sem sair da página.
                    </p>
                  </div>
                </div>
              </a>
            </nav>

            <div className={`border-t border-slate-100 bg-white px-4 pb-[calc(env(safe-area-inset-bottom)+16px)] pt-4 transition-all duration-300 ease-premium md:px-8 ${mobileOpen ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}`}>
              <div className="mb-4 flex justify-center">
                <SocialLinks className="justify-center" linkClassName="h-11 w-11" />
              </div>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
