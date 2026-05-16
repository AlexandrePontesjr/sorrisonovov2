import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Clock, Mail, MapPin, MessageCircleMore, Phone } from 'lucide-react';
import { WhatsAppButton } from '@/components/WhatsAppButton';
import { openClinicScheduler } from '@/lib/scheduler-events';

gsap.registerPlugin(ScrollTrigger);

const contactInfo = [
  {
    icon: MapPin,
    text: 'Rua Índio Ajuricaba, 22, Zumbi dos Palmares, Manaus AM, 69086-397, Brasil',
  },
  {
    icon: Clock,
    text: 'Segunda a Sexta: 8h às 18h / Sábado: 8h às 16h',
  },
  {
    icon: Phone,
    text: '(92) 98188-7734',
  },
  {
    icon: Mail,
    text: 'odonto.sorriso.novo.manaus1@gmail.com',
  },
];

export function Contato() {
  const sectionRef = useRef<HTMLElement>(null);
  const leftRef = useRef<HTMLDivElement>(null);
  const rightRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        leftRef.current,
        { opacity: 0, x: -20 },
        {
          opacity: 1,
          x: 0,
          duration: 0.5,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top 80%',
          },
        }
      );

      gsap.fromTo(
        rightRef.current,
        { opacity: 0, x: 20 },
        {
          opacity: 1,
          x: 0,
          duration: 0.5,
          delay: 0.2,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top 80%',
          },
        }
      );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      id="contato"
      ref={sectionRef}
      className="w-full bg-white py-20 lg:py-24"
    >
      <div className="max-w-[1200px] mx-auto px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16">
          {/* Left Column - Contact Info */}
          <div ref={leftRef} className="opacity-0 order-2 lg:order-1">
            <div className="mb-4 inline-flex items-center gap-3">
              <span className="h-px w-8 bg-coral" />
              <span className="font-inter text-xs font-semibold uppercase tracking-[0.08em] text-coral">
                Contato
              </span>
            </div>

            <h2 className="font-playfair text-3xl sm:text-4xl lg:text-[40px] font-bold text-dark leading-tight">
              Venha nos visitar
            </h2>

            {/* Contact Items */}
            <div className="mt-8 space-y-5">
              {contactInfo.map((item) => {
                const Icon = item.icon;
                return (
                  <div key={item.text} className="flex items-start gap-3">
                    <Icon className="w-5 h-5 text-coral flex-shrink-0 mt-0.5" />
                    <span className="font-inter text-base text-dark-light">
                      {item.text}
                    </span>
                  </div>
                );
              })}
            </div>

            {/* WhatsApp CTA Box */}
            <div className="mt-8 p-6 bg-whatsapp-light border border-whatsapp/20 rounded-2xl">
              <h3 className="font-inter text-lg font-semibold text-dark mb-2">
                Fale conosco pelo WhatsApp
              </h3>
              <p className="font-inter text-sm text-dark-light mb-5">
                Resposta rápida. Agende sua consulta em poucos minutos.
              </p>
              <div className="flex flex-col gap-3 sm:flex-row">
                <WhatsAppButton className="w-full sm:w-auto justify-center">
                  Iniciar conversa
                </WhatsAppButton>
              </div>
            </div>
          </div>

          {/* Right Column - Map */}
          <div ref={rightRef} className="opacity-0 order-1 lg:order-2">
            <div className="rounded-2xl overflow-hidden shadow-card h-[300px] lg:h-[400px]">
              <iframe
                src="https://www.google.com/maps?q=Rua%20%C3%8Dndio%20Ajuricaba%2C%2022%2C%20Zumbi%20dos%20Palmares%2C%20Manaus%20AM%2C%2069086-397%2C%20Brasil&z=15&output=embed"
                width="100%"
                height="100%"
                style={{ border: 0, filter: 'grayscale(0.1)' }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="Localização da Clínica SORRISO NOVO"
                className="w-full h-full"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
