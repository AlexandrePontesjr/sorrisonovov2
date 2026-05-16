import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ArrowRight, CalendarCheck, CheckCircle2, FileText, MessageCircle, Search, ShieldCheck } from 'lucide-react';
import { WhatsAppButton } from '@/components/WhatsAppButton';

gsap.registerPlugin(ScrollTrigger);

const steps = [
  {
    icon: Search,
    title: 'Avaliação completa',
    description: 'O dentista entende sua queixa, avalia sua saúde bucal e identifica prioridades reais.',
  },
  {
    icon: FileText,
    title: 'Plano explicado',
    description: 'Você recebe uma orientação clara sobre opções, etapas, tempo estimado e próximos cuidados.',
  },
  {
    icon: CalendarCheck,
    title: 'Próximo passo definido',
    description: 'A equipe organiza o melhor caminho para iniciar o tratamento com segurança e previsibilidade.',
  },
];

const guarantees = [
  'Sem começar tratamento sem você entender o motivo',
  'Orientação individual para sua rotina e necessidade',
  'Conversa clara sobre prioridades antes de decidir',
];

export function PlanoTratamento() {
  const sectionRef = useRef<HTMLElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        contentRef.current,
        { opacity: 0, y: 28 },
        {
          opacity: 1,
          y: 0,
          duration: 0.6,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top 78%',
          },
        }
      );

      if (cardRef.current) {
        gsap.fromTo(
          cardRef.current.querySelectorAll('.plan-reveal'),
          { opacity: 0, y: 24 },
          {
            opacity: 1,
            y: 0,
            duration: 0.45,
            stagger: 0.1,
            ease: 'power2.out',
            scrollTrigger: {
              trigger: cardRef.current,
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
      id="plano-tratamento"
      ref={sectionRef}
      className="w-full bg-offwhite py-20 lg:py-24"
    >
      <div className="max-w-[1200px] mx-auto px-6 lg:px-8">
        <div className="grid lg:grid-cols-[0.9fr_1.1fr] gap-10 lg:gap-14 items-center">
          <div ref={contentRef} className="opacity-0">
            <div className="mb-4 inline-flex items-center gap-3">
              <span className="h-px w-8 bg-coral" />
              <span className="font-inter text-xs font-semibold uppercase tracking-[0.08em] text-coral">
                Plano de Tratamento
              </span>
            </div>

            <h2 className="font-playfair text-3xl sm:text-4xl lg:text-[40px] font-bold text-dark leading-tight">
              Você entende cada passo antes de começar
            </h2>

            <p className="mt-6 font-inter text-base text-dark-light leading-[1.7] max-w-[560px]">
              Na primeira avaliação, a equipe organiza um plano simples de entender, com prioridades bem definidas para você decidir com tranquilidade.
            </p>

            <div className="mt-8 space-y-4">
              {guarantees.map((item) => (
                <div key={item} className="flex items-start gap-3">
                  <CheckCircle2 className="mt-0.5 h-5 w-5 flex-shrink-0 text-whatsapp" />
                  <span className="font-inter text-base font-medium text-dark">
                    {item}
                  </span>
                </div>
              ))}
            </div>

            <div className="mt-9">
              <WhatsAppButton>
                Agendar avaliação
              </WhatsAppButton>
            </div>
          </div>

          <div
            ref={cardRef}
            className="rounded-2xl bg-white p-5 sm:p-6 shadow-card border border-coral/10"
          >
            <div className="plan-reveal rounded-xl bg-dark px-6 py-5 text-white">
              <div className="flex items-start justify-between gap-5">
                <div>
                  <p className="font-inter text-sm text-white/65">Consulta inicial</p>
                  <h3 className="mt-1 font-playfair text-2xl font-bold">
                    Diagnóstico com orientação
                  </h3>
                </div>
                <div className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-full bg-coral">
                  <ShieldCheck className="h-5 w-5" />
                </div>
              </div>
            </div>

            <div className="mt-5 grid gap-4">
              {steps.map((step, index) => {
                const Icon = step.icon;

                return (
                  <div
                    key={step.title}
                    className="plan-reveal grid grid-cols-[48px_1fr] gap-4 rounded-xl border border-slate-100 bg-white p-4 shadow-xs"
                  >
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-coral/10 text-coral">
                      <Icon className="h-6 w-6" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-inter text-xs font-semibold text-coral">
                          0{index + 1}
                        </span>
                        <h4 className="font-inter text-base font-semibold text-dark">
                          {step.title}
                        </h4>
                      </div>
                      <p className="mt-1.5 font-inter text-sm leading-relaxed text-dark-light">
                        {step.description}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="plan-reveal mt-5 flex flex-col gap-4 rounded-xl bg-whatsapp-light p-5 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-center gap-3">
                <MessageCircle className="h-5 w-5 flex-shrink-0 text-whatsapp" />
                <p className="font-inter text-sm font-medium text-dark">
                  Tire dúvidas pelo WhatsApp antes de agendar.
                </p>
              </div>
              <ArrowRight className="hidden h-5 w-5 text-whatsapp sm:block" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
