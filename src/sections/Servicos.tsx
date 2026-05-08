import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Sparkles, Sun, Smile, CircleDot, AlertCircle, Baby } from 'lucide-react';
import { WhatsAppButton } from '@/components/WhatsAppButton';

gsap.registerPlugin(ScrollTrigger);

const services = [
  {
    icon: Sparkles,
    title: 'Limpeza Dental',
    description: 'Remoção de tártaro e placa bacteriana para manter seus dentes saudáveis e seu hálito fresco.',
    image: '/servico-limpeza.webp',
  },
  {
    icon: Sun,
    title: 'Clareamento Dental',
    description: 'Devolva o branco natural dos seus dentes com técnicas seguras e resultados comprovados.',
    image: '/servico-clareamento.jpg',
  },
  {
    icon: Smile,
    title: 'Aparelho Ortodôntico',
    description: 'Alinhamento dental com aparelhos tradicionais ou transparentes para todos os estilos.',
    image: '/servico-aparelho.jpg',
  },
  {
    icon: CircleDot,
    title: 'Implantes Dentários',
    description: 'Reposição de dentes perdidos com implantes de titânio e coroas de alta estética.',
    image: '/servico-implante.jpg',
  },
  {
    icon: AlertCircle,
    title: 'Atendimento de Urgência',
    description: 'Dor de dente, trauma ou inflamação? Atendimento rápido para aliviar seu desconforto.',
    image: '/servico-urgencia.webp',
  },
  {
    icon: Baby,
    title: 'Odontopediatria',
    description: 'Cuidado especializado para crianças, com ambiente acolhedor e profissionais preparados.',
    image: '/servico-odonto-ped.webp',
  },
];

export function Servicos() {
  const sectionRef = useRef<HTMLElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const cardsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        headerRef.current,
        { opacity: 0, y: 30 },
        {
          opacity: 1,
          y: 0,
          duration: 0.6,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top 80%',
          },
        }
      );

      if (cardsRef.current) {
        const cards = cardsRef.current.children;
        gsap.fromTo(
          cards,
          { opacity: 0, y: 40 },
          {
            opacity: 1,
            y: 0,
            duration: 0.5,
            stagger: 0.1,
            ease: 'power2.out',
            scrollTrigger: {
              trigger: cardsRef.current,
              start: 'top 80%',
            },
          }
        );
      }
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      id="servicos"
      ref={sectionRef}
      className="w-full bg-offwhite py-20 lg:py-24"
    >
      <div className="max-w-[1200px] mx-auto px-6 lg:px-8">
        {/* Section Header */}
        <div ref={headerRef} className="text-center mb-14 opacity-0">
          <div className="mb-4 inline-flex items-center justify-center gap-3">
            <span className="h-px w-8 bg-coral" />
            <span className="font-inter text-xs font-semibold uppercase tracking-[0.08em] text-coral">
              Nossos Serviços
            </span>
          </div>
          <h2 className="font-playfair text-3xl sm:text-4xl lg:text-[40px] font-bold text-dark leading-tight">
            Cuidamos do seu sorriso com excelência
          </h2>
          <p className="mt-4 font-inter text-lg text-dark-light max-w-[640px] mx-auto">
            Oferecemos tratamentos completos para toda a família, com tecnologia moderna e profissionais especializados.
          </p>
        </div>

        {/* Services Grid */}
        <div
          ref={cardsRef}
          className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          {services.map((service) => {
            const Icon = service.icon;
            return (
              <div
                key={service.title}
                className="group bg-white rounded-2xl shadow-card overflow-hidden transition-all duration-300 hover:-translate-y-2 hover:shadow-card-hover hover:border hover:border-coral/20 opacity-0"
              >
                {/* Image */}
                <div className="aspect-square overflow-hidden">
                  <img
                    src={service.image}
                    alt={service.title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                </div>
                {/* Content */}
                <div className="p-6">
                  <div className="w-12 h-12 rounded-xl bg-coral/10 flex items-center justify-center mb-4">
                    <Icon className="w-6 h-6 text-coral" />
                  </div>
                  <h3 className="font-inter text-xl font-semibold text-dark mb-2">
                    {service.title}
                  </h3>
                  <p className="font-inter text-base text-dark-light leading-relaxed">
                    {service.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        {/* WhatsApp CTA */}
        <div className="mt-14 text-center">
          <p className="font-inter text-base text-dark-light mb-5">
            Não encontrou o que procura? Fale conosco pelo WhatsApp
          </p>
          <WhatsAppButton>
            Falar no WhatsApp
          </WhatsAppButton>
        </div>
      </div>
    </section>
  );
}
