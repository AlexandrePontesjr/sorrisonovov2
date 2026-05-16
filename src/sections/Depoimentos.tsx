import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Star } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

const testimonials = [
  {
    quote: 'Atendimento excelente! Fiz o clareamento e o resultado superou minhas expectativas. A equipe é muito atenciosa e o ambiente é super acolhedor.',
    name: 'Ana Carolina M.',
    avatar: '/mundica.webp',
  },
  {
    quote: 'Levei meu filho de 5 anos para a primeira consulta e ele adorou! A dentista foi super paciente e divertida. Indico para todas as mamães!',
    name: 'Patrícia L.',
    avatar: '/Dani-crianca.webp',
  },
  {
    quote: 'Fiz o implante com o Dra. Daniela e o resultado ficou perfeito. Processo tranquilo, sem dor e com acompanhamento de primeira.',
    name: 'Marcos S.',
    avatar: '/Koreano.webp',
  },
];

const stats = [
  { value: '5.000+', label: 'Pacientes Atendidos' },
  { value: '4.9', label: 'Nota Google' },
  { value: '98%', label: 'Taxa de Satisfação' },
];

export function Depoimentos() {
  const sectionRef = useRef<HTMLElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const cardsRef = useRef<HTMLDivElement>(null);
  const statsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        headerRef.current,
        { opacity: 0, y: 30 },
        {
          opacity: 1,
          y: 0,
          duration: 0.5,
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
          { opacity: 0, y: 30 },
          {
            opacity: 1,
            y: 0,
            duration: 0.5,
            stagger: 0.15,
            ease: 'power2.out',
            scrollTrigger: {
              trigger: cardsRef.current,
              start: 'top 80%',
            },
          }
        );
      }

      gsap.fromTo(
        statsRef.current,
        { opacity: 0, y: 20 },
        {
          opacity: 1,
          y: 0,
          duration: 0.5,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: statsRef.current,
            start: 'top 85%',
          },
        }
      );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      id="depoimentos"
      ref={sectionRef}
      className="w-full bg-offwhite py-20 lg:py-24"
    >
      <div className="max-w-[1200px] mx-auto px-6 lg:px-8">
        {/* Section Header */}
        <div ref={headerRef} className="text-center mb-14 opacity-0">
          <div className="mb-4 inline-flex items-center justify-center gap-3">
            <span className="h-px w-8 bg-coral" />
            <span className="font-inter text-xs font-semibold uppercase tracking-[0.08em] text-coral">
              Depoimentos
            </span>
          </div>
          <h2 className="font-playfair text-3xl sm:text-4xl lg:text-[40px] font-bold text-dark leading-tight">
            O que nossos pacientes dizem
          </h2>
        </div>

        {/* Testimonial Cards */}
        <div
          ref={cardsRef}
          className="grid md:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          {testimonials.map((testimonial) => (
            <div
              key={testimonial.name}
              className="bg-white rounded-2xl shadow-card p-8 border-l-4 border-coral opacity-0"
            >
              {/* Stars */}
              <div className="flex gap-1 mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                ))}
              </div>

              {/* Quote */}
              <p className="font-inter text-lg italic text-dark leading-relaxed mb-6">
                "{testimonial.quote}"
              </p>

              {/* Divider */}
              <div className="w-full h-px bg-slate-100 mb-5" />

              {/* Author */}
              <div className="flex items-center gap-3">
                <img
                  src={testimonial.avatar}
                  alt={testimonial.name}
                  className="w-12 h-12 rounded-full object-cover"
                />
                {/* <span className="font-inter text-base font-semibold text-dark">
                  {testimonial.name}
                </span> */}
              </div>
            </div>
          ))}
        </div>

        {/* Stats Bar */}
        <div
          ref={statsRef}
          className="mt-16 flex flex-col sm:flex-row items-center justify-center gap-8 sm:gap-12 opacity-0"
        >
          {stats.map((stat, index) => (
            <div key={stat.label} className="flex items-center gap-8 sm:gap-12">
              <div className="text-center">
                <p className="font-playfair text-4xl font-bold text-coral">
                  {stat.value}
                </p>
                <p className="font-inter text-sm text-dark-light mt-1">
                  {stat.label}
                </p>
              </div>
              {index < stats.length - 1 && (
                <div className="hidden sm:block w-px h-14 bg-slate-200" />
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
