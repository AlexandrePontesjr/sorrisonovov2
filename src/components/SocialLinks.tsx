import { Facebook, Instagram } from 'lucide-react';

const socialLinks = [
  {
    label: 'Facebook da Clinica Sorriso Novo',
    href: 'https://www.facebook.com/share/14Zh2vwUvTQ/?mibextid=wwXIfr',
    icon: Facebook,
  },
  {
    label: 'Instagram da Clinica Sorriso Novo',
    href: 'https://www.instagram.com/clinicasorriso_novo?igsh=bjk3NnZubnN6amdw',
    icon: Instagram,
  },
];

type SocialLinksProps = {
  className?: string;
  linkClassName?: string;
};

export function SocialLinks({ className = '', linkClassName = '' }: SocialLinksProps) {
  return (
    <div className={`flex items-center gap-2 ${className}`}>
      {socialLinks.map(({ label, href, icon: Icon }) => (
        <a
          key={href}
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={label}
          title={label}
          className={`inline-flex h-9 w-9 items-center justify-center rounded-full border border-slate-200 bg-white/80 text-dark-light transition-all duration-200 hover:-translate-y-0.5 hover:border-coral/40 hover:bg-white hover:text-coral hover:shadow-card ${linkClassName}`}
        >
          <Icon className="h-4 w-4" strokeWidth={1.8} />
        </a>
      ))}
    </div>
  );
}
