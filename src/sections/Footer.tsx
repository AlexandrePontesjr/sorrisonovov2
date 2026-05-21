import { Facebook, Instagram } from 'lucide-react';

const quickLinks = [
  { label: 'Início', href: '#hero' },
  { label: 'Serviços', href: '#servicos' },
  { label: 'Sobre', href: '#sobre' },
  { label: 'Contato', href: '#contato' },
];

const socialLinks = [
  {
    icon: Facebook,
    label: 'Facebook',
    href: 'https://www.facebook.com/share/14Zh2vwUvTQ/?mibextid=wwXIfr',
  },
  {
    icon: Instagram,
    label: 'Instagram',
    href: 'https://www.instagram.com/clinicasorriso_novo?igsh=bjk3NnZubnN6amdw',
  },
];

export function Footer() {
  const handleNavClick = (href: string) => {
    const element = document.querySelector(href);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <footer className="w-full bg-dark text-white">
      <div className="max-w-[1200px] mx-auto px-6 lg:px-8 pt-16 pb-8">
        {/* Main Footer Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-8">
          {/* Logo & Description */}
          <div className="sm:col-span-2 lg:col-span-1">
            <div className="flex items-center gap-2 mb-4">
              <img src="/logo.png" alt="Logo da clínica Sorriso Novo" className="h-10 w-18" />
              <span className="font-playfair text-xl font-bold">SORRISO NOVO</span>
            </div>
            <p className="font-inter text-sm text-dark-muted leading-relaxed">
              Cuidando do seu sorriso com excelência há mais de 10 anos.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-inter text-base font-semibold mb-4">Links Rápidos</h4>
            <ul className="space-y-2.5">
              {quickLinks.map((link) => (
                <li key={link.href}>
                  <a
                    href={link.href}
                    onClick={(e) => {
                      e.preventDefault();
                      handleNavClick(link.href);
                    }}
                    className="font-inter text-sm text-dark-muted hover:text-white transition-colors duration-200"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="font-inter text-base font-semibold mb-4">Contato</h4>
            <ul className="space-y-2.5">
              <li className="font-inter text-sm text-dark-muted">
                (92) 98188-7734
              </li>
              <li className="font-inter text-sm text-dark-muted">
                odonto.sorriso.novo.manaus1@gmail.com
              </li>
              <li className="font-inter text-sm text-dark-muted">
                Rua Índio Ajuricaba, 22
              </li>
            </ul>
          </div>

          {/* Social Media */}
          <div>
            <h4 className="font-inter text-base font-semibold mb-4">Redes Sociais</h4>
            <div className="flex gap-3">
              {socialLinks.map((social) => {
                const Icon = social.icon;
                return (
                  <a
                    key={social.label}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center text-dark-muted hover:text-coral hover:bg-white/15 transition-all duration-200"
                    aria-label={social.label}
                    title={social.label}
                  >
                    <Icon className="w-5 h-5" />
                  </a>
                );
              })}
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-6 border-t border-slate-700 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="font-inter text-xs text-slate-500 text-center sm:text-left">
            © 2026 Clínica SORRISO NOVO. Todos os direitos reservados.
          </p>
          {/* <p className="font-inter text-xs text-slate-500">
            CRO-AM 12345 | Política de Privacidade
          </p> */}
        </div>
      </div>
    </footer>
  );
}
