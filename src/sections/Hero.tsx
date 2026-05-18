import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { Award, CalendarCheck, Sparkles, Star, Users } from 'lucide-react';
import { WhatsAppButton } from '@/components/WhatsAppButton';

const heroImages = [
  {
    src: '/dentista-1.webp',
    alt: 'Dentista da clínica Sorriso Novo em atendimento odontológico',
  },
  {
    src: '/dentista-2.webp',
    alt: 'Dentista da clínica Sorriso Novo sorrindo no consultório',
  },
  {
    src: '/dentista-3.webp',
    alt: 'Dentista da clínica Sorriso Novo em consultório odontológico',
  },
];

export function Hero() {
  const [currentHeroImage, setCurrentHeroImage] = useState(0);
  const sectionRef = useRef<HTMLElement>(null);
  const labelRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const subtitleRef = useRef<HTMLParagraphElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);
  const trustRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: 'power2.out' } });

      tl.fromTo(labelRef.current, { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.4 }, 0.2)
        .fromTo(titleRef.current, { opacity: 0, y: 30 }, { opacity: 1, y: 0, duration: 0.6 }, 0.3)
        .fromTo(subtitleRef.current, { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.5 }, 0.5)
        .fromTo(ctaRef.current, { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.5 }, 0.7)
        .fromTo(trustRef.current, { opacity: 0 }, { opacity: 1, duration: 0.4 }, 0.9)
        .fromTo(imageRef.current, { opacity: 0, scale: 0.95 }, { opacity: 1, scale: 1, duration: 0.8 }, 0.4);
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  useEffect(() => {
    const intervalId = window.setInterval(() => {
      setCurrentHeroImage((current) => (current + 1) % heroImages.length);
    }, 3000);

    return () => window.clearInterval(intervalId);
  }, []);

  const handleScrollToServices = () => {
    const element = document.querySelector('#servicos');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section
      id="hero"
      ref={sectionRef}
      className="relative flex min-h-screen w-full items-center overflow-hidden pt-[72px]"
    >
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <img
          src="/consultorio1.jpg"
          alt="Consultório odontológico moderno"
          className="h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-br from-coral-50/90 via-white/75 to-yellow-brand/20" />
        <div className="absolute inset-0 bg-gradient-to-r from-white/95 via-white/80 to-white/30" />
      </div>

      {/* Content */}
      <div className="relative z-10 mx-auto w-full max-w-[1200px] px-6 py-12 lg:px-8 lg:py-20">
        <div className="grid items-center gap-10 lg:grid-cols-[50%_50%] lg:gap-14">
          {/* Text Column */}
          <div className="text-center lg:text-left">
            <div
              ref={labelRef}
              className="mb-6 inline-flex items-center gap-3 opacity-0"
            >
              <span className="h-px w-8 bg-coral" />
              <span className="font-inter text-xs font-semibold uppercase tracking-[0.08em] text-coral">
                Clínica odontológica
              </span>
            </div>

            <h1
              ref={titleRef}
              className="font-playfair text-4xl font-bold leading-[1.04] tracking-tight text-dark opacity-0 sm:text-5xl lg:text-[56px]"
              style={{ textShadow: '0 2px 12px rgba(255,255,255,0.6)' }}
            >
              Volte a sorrir com segurança em cada detalhe
            </h1>

            <p
              ref={subtitleRef}
              className="mx-auto mt-5 max-w-[540px] font-inter text-lg leading-relaxed text-dark-light opacity-0 lg:mx-0"
            >
              Cuidado odontológico acolhedor, planejamento claro e tecnologia moderna para você tratar, prevenir e transformar seu sorriso sem adiar mais.
            </p>

            <div className="mt-5 flex flex-wrap items-center justify-center gap-3 lg:justify-start">
              <span className="inline-flex items-center gap-2 rounded-full bg-white/85 px-4 py-2 font-inter text-sm font-semibold text-dark shadow-card">
                <Sparkles className="h-4 w-4 text-yellow-brand" />
                Avaliação com orientação personalizada
              </span>
              <span className="inline-flex items-center gap-2 rounded-full bg-white/85 px-4 py-2 font-inter text-sm font-semibold text-dark shadow-card">
                <CalendarCheck className="h-4 w-4 text-coral" />
                Agendamento rápido pelo WhatsApp
              </span>
            </div>

            {/* CTAs */}
            <div
              ref={ctaRef}
              className="mt-10 flex flex-col items-center justify-center gap-4 opacity-0 sm:flex-row lg:justify-start"
            >
              <WhatsAppButton>
                Falar no WhatsApp
              </WhatsAppButton>
              <button
                onClick={handleScrollToServices}
                className="inline-flex items-center rounded-3xl border-2 border-coral px-8 py-3 font-inter text-[15px] font-semibold text-coral transition-all duration-200 hover:bg-coral hover:text-white active:scale-[0.98]"
              >
                Ver serviços
              </button>
            </div>
            {/* Trust Indicators */}
            <div
              ref={trustRef}
              className="mt-12 flex flex-wrap items-center justify-center gap-6 opacity-0 lg:justify-start lg:gap-8"
            >
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-coral/10">
                  <Award className="h-5 w-5 text-coral" />
                </div>
                <div className="text-left">
                  <p className="font-inter text-sm font-bold text-dark">+10 anos</p>
                  <p className="font-inter text-xs text-dark-muted">de experiência</p>
                </div>
              </div>

              <div className="hidden h-10 w-px bg-slate-200 sm:block" />

              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-coral/10">
                  <Users className="h-5 w-5 text-coral" />
                </div>
                <div className="text-left">
                  <p className="font-inter text-sm font-bold text-dark">5.000+</p>
                  <p className="font-inter text-xs text-dark-muted">pacientes atendidos</p>
                </div>
              </div>

              <div className="hidden h-10 w-px bg-slate-200 sm:block" />

              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-coral/10">
                  <Star className="h-5 w-5 text-coral" />
                </div>
                <div className="text-left">
                  <p className="font-inter text-sm font-bold text-dark">4.9 estrelas</p>
                  <p className="font-inter text-xs text-dark-muted">avaliação Google</p>
                </div>
              </div>
            </div>
          </div>

          {/* Hero Image Column */}
          <div
            ref={imageRef}
            className="flex items-center justify-center opacity-0 lg:justify-end"
          >
            <div className="relative w-full max-w-[390px] sm:max-w-[430px] lg:max-w-[500px]">
              <div className="absolute -left-4 top-8 hidden h-24 w-24 rounded-full bg-yellow-brand/25 blur-2xl sm:block" />
              <div className="absolute -right-5 bottom-10 hidden h-28 w-28 rounded-full bg-coral/25 blur-2xl sm:block" />

              <div className="relative aspect-[4/5] overflow-hidden rounded-[32px] border-[10px] border-white bg-white shadow-[0_28px_70px_rgba(30,41,59,0.18)]">
                <img
                  src={heroImages[0].src}
                  aria-hidden={currentHeroImage !== 0}
                  alt="Dentista da clínica Sorriso Novo em consultório odontológico"
                  className={`absolute inset-0 h-full w-full object-cover object-[50%_35%] transition-opacity duration-700 ${
                    currentHeroImage === 0 ? 'opacity-100' : 'opacity-0'
                  }`}
                />
                {heroImages.slice(1).map((image, index) => {
                  const imageIndex = index + 1;

                  return (
                    <img
                      key={image.src}
                      src={image.src}
                      alt={image.alt}
                      aria-hidden={imageIndex !== currentHeroImage}
                      className={`absolute inset-0 h-full w-full object-cover object-[50%_35%] transition-opacity duration-700 ${
                        imageIndex === currentHeroImage ? 'opacity-100' : 'opacity-0'
                      }`}
                    />
                  );
                })}
              </div>

              <div className="absolute left-6 bottom-8 hidden max-w-[210px] rounded-2xl bg-white px-5 py-4 shadow-card-hover sm:block">
                <p className="font-inter text-xs font-semibold uppercase tracking-[0.08em] text-coral">
                  Atendimento próximo
                </p>
                <p className="mt-1 font-inter text-sm font-semibold leading-snug text-dark">
                  Da avaliação ao tratamento, você entende cada passo antes de começar.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
