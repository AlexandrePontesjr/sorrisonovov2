import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { CheckCircle2 } from 'lucide-react';
import { WhatsAppButton } from '@/components/WhatsAppButton';

gsap.registerPlugin(ScrollTrigger);

const differentials = [
  'Tecnologia digital de última geração',
  'Equipe com especialistas renomados',
  'Ambiente acolhedor e relaxante',
  'Protocolos rigorosos de biossegurança',
];

export function Sobre() {
  const sectionRef = useRef<HTMLElement>(null);
  const leftRef = useRef<HTMLDivElement>(null);
  const rightRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        leftRef.current,
        { opacity: 0, x: -30 },
        {
          opacity: 1,
          x: 0,
          duration: 0.6,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top 80%',
          },
        }
      );

      gsap.fromTo(
        rightRef.current,
        { opacity: 0, x: 30 },
        {
          opacity: 1,
          x: 0,
          duration: 0.6,
          delay: 0.2,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top 80%',
          },
        }
      );

      const items = leftRef.current?.querySelectorAll('.differential-item');
      if (items) {
        gsap.fromTo(
          items,
          { opacity: 0, x: -20 },
          {
            opacity: 1,
            x: 0,
            duration: 0.4,
            stagger: 0.1,
            ease: 'power2.out',
            scrollTrigger: {
              trigger: leftRef.current,
              start: 'top 75%',
            },
          }
        );
      }
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      id="sobre"
      ref={sectionRef}
      className="w-full bg-white py-20 lg:py-24"
    >
      <div className="max-w-[1200px] mx-auto px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Text Column */}
          <div ref={leftRef} className="opacity-0 order-2 lg:order-1">
            <div className="mb-4 inline-flex items-center gap-3">
              <span className="h-px w-8 bg-coral" />
              <span className="font-inter text-xs font-semibold uppercase tracking-[0.08em] text-coral">
                Sobre Nós
              </span>
            </div>

            <h2 className="font-playfair text-3xl sm:text-4xl lg:text-[40px] font-bold text-dark leading-tight">
              Uma clínica feita para cuidar de você
            </h2>

            <p className="mt-6 font-inter text-base text-dark-light leading-[1.7]">
              A Clínica SORRISO NOVO nasceu da paixão por transformar vidas através da odontologia. Com mais de 10 anos de experiência, nossa equipe de especialistas está preparada para oferecer o melhor em saúde bucal, combinando tecnologia de ponta com um atendimento acolhedor e humanizado.
            </p>

            {/* Differentials */}
            <div className="mt-8 space-y-4">
              {differentials.map((item) => (
                <div
                  key={item}
                  className="differential-item flex items-center gap-3 opacity-0"
                >
                  <CheckCircle2 className="w-5 h-5 text-whatsapp flex-shrink-0" />
                  <span className="font-inter text-base font-medium text-dark">
                    {item}
                  </span>
                </div>
              ))}
            </div>

            {/* CTA */}
            <div className="mt-8">
              <WhatsAppButton>
                Agendar consulta
              </WhatsAppButton>
            </div>
          </div>

          {/* Images Column */}
          <div ref={rightRef} className="opacity-0 order-1 lg:order-2">
            <div className="grid gap-4">
              <div className="rounded-xl overflow-hidden shadow-lg">
                <img
                  src="/equipe.jpg"
                  alt="Equipe de dentistas"
                  className="w-full aspect-video object-cover"
                />
              </div>
              <div className="rounded-xl overflow-hidden shadow-lg lg:rotate-[2deg]">
                <img
                  src="/consultorio2.jpg"
                  alt="Recepção da clínica"
                  className="w-full aspect-video object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
