import { useEffect, useRef, useState } from 'react';
import {
  Bot,
  CheckCircle2,
  Clock3,
  MessageCircleMore,
  MoveRight,
  Phone,
  Sparkles,
  X,
} from 'lucide-react';
import type { FormEvent } from 'react';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Textarea } from '@/components/ui/textarea';
import { WhatsAppButton } from '@/components/WhatsAppButton';
import {
  CLINIC_SCHEDULER_OPEN_EVENT,
  openClinicScheduler,
} from '@/lib/scheduler-events';

const serviceOptions = [
  'Limpeza dental',
  'Clareamento dental',
  'Aparelho ortodontico',
  'Implante dentario',
  'Urgencia odontologica',
  'Odontopediatria',
];

const appointmentSchema = z.object({
  patientName: z.string().trim().min(2, 'Informe seu nome'),
  phone: z.string().trim().min(8, 'Informe seu telefone'),
  service: z.string().trim().min(3, 'Escolha um atendimento'),
  preferredDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Escolha uma data valida'),
  preferredTime: z.string().regex(/^\d{2}:\d{2}$/, 'Escolha um horario valido'),
  notes: z.string().trim().optional().default(''),
});

type Step = 'service' | 'date' | 'time' | 'name' | 'phone' | 'notes' | 'review' | 'done';

type Message = {
  id: number;
  role: 'bot' | 'patient' | 'system';
  text: string;
};

type Draft = z.infer<typeof appointmentSchema>;

const initialDraft: Draft = {
  patientName: '',
  phone: '',
  service: '',
  preferredDate: '',
  preferredTime: '',
  notes: '',
};

const initialMessages: Message[] = [
  {
    id: 1,
    role: 'bot',
    text: 'Oi, eu sou o assistente de agendamento da Clinica Sorriso Novo. Vou registrar sua consulta no Google Calendar da clinica.',
  },
  {
    id: 2,
    role: 'bot',
    text: 'Vamos comecar pelo tipo de atendimento.',
  },
];

function formatSummaryDate(date: string) {
  if (!date) return 'Selecione uma data';
  return new Date(`${date}T12:00:00`).toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: 'long',
  });
}

export function AppointmentChatbot() {
  const [open, setOpen] = useState(false);
  const [step, setStep] = useState<Step>('service');
  const [draft, setDraft] = useState<Draft>(initialDraft);
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [pendingValue, setPendingValue] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [alternatives, setAlternatives] = useState<string[]>([]);
  const scrollRef = useRef<HTMLDivElement>(null);
  const nextId = useRef(3);

  useEffect(() => {
    const handleOpen = () => setOpen(true);
    window.addEventListener(CLINIC_SCHEDULER_OPEN_EVENT, handleOpen);
    return () => window.removeEventListener(CLINIC_SCHEDULER_OPEN_EVENT, handleOpen);
  }, []);

  useEffect(() => {
    if (!open) return;
    scrollRef.current?.scrollIntoView({ behavior: 'smooth', block: 'end' });
  }, [messages, open, step, busy, alternatives.length]);

  const pushMessage = (role: Message['role'], text: string) => {
    setMessages((current) => [...current, { id: nextId.current++, role, text }]);
  };

  const moveToStep = (nextStep: Step, reply: string, botPrompt?: string) => {
    if (reply) {
      pushMessage('patient', reply);
    }
    if (botPrompt) {
      pushMessage('bot', botPrompt);
    }
    setStep(nextStep);
    setPendingValue('');
    setError(null);
    setAlternatives([]);
  };

  const handleServiceSelect = (service: string) => {
    setDraft((current) => ({ ...current, service }));
    moveToStep('date', service, 'Perfeito. Agora me diga a data desejada.');
  };

  const handleTextSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!pendingValue.trim()) return;

    if (step === 'date') {
      setDraft((current) => ({ ...current, preferredDate: pendingValue }));
      moveToStep('time', formatSummaryDate(pendingValue), 'Agora escolha o horario preferido.');
      return;
    }

    if (step === 'time') {
      setDraft((current) => ({ ...current, preferredTime: pendingValue }));
      moveToStep('name', pendingValue, 'Me informe seu nome completo, por favor.');
      return;
    }

    if (step === 'name') {
      setDraft((current) => ({ ...current, patientName: pendingValue }));
      moveToStep('phone', pendingValue, 'Agora, qual telefone devemos usar para confirmar o agendamento?');
      return;
    }

    if (step === 'phone') {
      setDraft((current) => ({ ...current, phone: pendingValue }));
      moveToStep('notes', pendingValue, 'Se quiser, deixe uma observacao. Se nao houver, pode enviar em branco.');
      return;
    }

    if (step === 'notes') {
      setDraft((current) => ({ ...current, notes: pendingValue }));
      setMessages((current) => [
        ...current,
        { id: nextId.current++, role: 'patient', text: pendingValue || 'Sem observacoes' },
        {
          id: nextId.current++,
          role: 'bot',
          text: 'Confere o resumo e toque em confirmar para eu tentar reservar o horario no calendario da clinica.',
        },
      ]);
      setStep('review');
      setPendingValue('');
    }
  };

  const handleConfirm = async () => {
    const result = appointmentSchema.safeParse(draft);
    if (!result.success) {
      setError(result.error.issues[0]?.message ?? 'Revise os dados do agendamento.');
      return;
    }

    setBusy(true);
    setError(null);

    try {
      const response = await fetch('/api/appointments', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(result.data),
      });

      const payload = await response.json();

      if (!response.ok) {
        if (payload?.alternatives?.length) {
          setAlternatives(payload.alternatives);
          setStep('time');
          setPendingValue('');
          pushMessage('system', payload.message ?? 'Esse horario ja esta ocupado. Tente uma das sugestoes.');
          return;
        }

        throw new Error(payload?.message ?? 'Nao foi possivel concluir o agendamento.');
      }

      pushMessage('bot', `Agendamento confirmado. Evento criado para ${formatSummaryDate(draft.preferredDate)} as ${draft.preferredTime}.`);
      setStep('done');
    } catch (caughtError) {
      const message = caughtError instanceof Error ? caughtError.message : 'Falha ao agendar.';
      setError(message);
      pushMessage('system', message);
    } finally {
      setBusy(false);
    }
  };

  const handleAlternative = (value: string) => {
    setDraft((current) => ({ ...current, preferredTime: value }));
    setPendingValue(value);
    setAlternatives([]);
    setStep('review');
    pushMessage('patient', value);
    pushMessage('bot', 'Horario ajustado. Toque em confirmar para reservar.');
  };

  const currentSummary = [
    { label: 'Atendimento', value: draft.service || 'Selecione um atendimento' },
    { label: 'Data', value: formatSummaryDate(draft.preferredDate) },
    { label: 'Horario', value: draft.preferredTime || 'Selecione um horario' },
    { label: 'Nome', value: draft.patientName || 'Informe seu nome' },
    { label: 'Telefone', value: draft.phone || 'Informe seu telefone' },
  ];

  return (
    <>
      {!open && (
        <button
          type="button"
          onClick={() => setOpen(true)}
          className="fixed bottom-6 left-6 z-50 inline-flex items-center gap-3 rounded-full bg-dark px-4 py-3 text-white shadow-card-hover transition-transform duration-200 hover:-translate-y-0.5"
          aria-label="Abrir assistente de agendamento"
        >
          <span className="flex h-10 w-10 items-center justify-center rounded-full bg-coral/15 text-coral">
            <Bot className="h-5 w-5" />
          </span>
          <span className="flex flex-col items-start">
            <span className="font-inter text-xs uppercase tracking-[0.08em] text-slate-300">
              Assistente da clinica
            </span>
            <span className="font-inter text-sm font-semibold">
              Agendar consulta
            </span>
          </span>
        </button>
      )}

      {open && (
        <div className="fixed bottom-4 left-4 right-4 z-50 mx-auto flex h-[min(780px,calc(100vh-2rem))] w-[min(420px,calc(100vw-2rem))] flex-col overflow-hidden rounded-[28px] border border-slate-200 bg-white shadow-[0_28px_80px_rgba(15,23,42,0.22)] sm:left-6 sm:right-auto">
          <div className="flex items-center justify-between bg-gradient-to-r from-dark to-dark-light px-5 py-4 text-white">
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-white/10 text-coral">
                <Sparkles className="h-5 w-5" />
              </div>
              <div>
                <p className="font-inter text-xs uppercase tracking-[0.08em] text-slate-300">
                  Agendamento guiado
                </p>
                <h3 className="font-inter text-base font-semibold">
                  Clinica Sorriso Novo
                </h3>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setOpen(false)}
              className="rounded-full p-2 text-slate-300 transition-colors hover:bg-white/10 hover:text-white"
              aria-label="Fechar assistente"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          <div className="flex flex-1 flex-col bg-offwhite/70">
            <ScrollArea className="flex-1 px-4 py-4">
              <div className="space-y-3">
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex ${message.role === 'patient' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-[85%] rounded-2xl px-4 py-3 font-inter text-sm leading-relaxed shadow-sm ${
                        message.role === 'patient'
                          ? 'bg-coral text-white'
                          : message.role === 'system'
                            ? 'border border-amber-200 bg-amber-50 text-amber-900'
                            : 'border border-slate-200 bg-white text-dark'
                      }`}
                    >
                      {message.text}
                    </div>
                  </div>
                ))}

                {step === 'service' && (
                  <div className="rounded-2xl border border-slate-200 bg-white p-3 shadow-sm">
                    <p className="mb-3 font-inter text-xs font-semibold uppercase tracking-[0.08em] text-coral">
                      Selecione o atendimento
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {serviceOptions.map((service) => (
                        <Button
                          key={service}
                          type="button"
                          variant="outline"
                          className="h-auto rounded-full border-slate-200 bg-white px-4 py-2 text-dark hover:border-coral hover:text-coral"
                          onClick={() => handleServiceSelect(service)}
                        >
                          {service}
                        </Button>
                      ))}
                    </div>
                  </div>
                )}

                {step === 'date' && (
                  <form onSubmit={handleTextSubmit} className="rounded-2xl border border-slate-200 bg-white p-3 shadow-sm">
                    <label className="mb-2 block font-inter text-xs font-semibold uppercase tracking-[0.08em] text-coral">
                      Data preferida
                    </label>
                    <Input
                      type="date"
                      value={pendingValue}
                      onChange={(event) => setPendingValue(event.target.value)}
                      className="h-12 rounded-2xl"
                    />
                    <Button type="submit" className="mt-3 w-full rounded-2xl bg-coral text-white hover:bg-coral-dark">
                      Avancar
                    </Button>
                  </form>
                )}

                {step === 'time' && (
                  <div className="rounded-2xl border border-slate-200 bg-white p-3 shadow-sm">
                    <label className="mb-2 block font-inter text-xs font-semibold uppercase tracking-[0.08em] text-coral">
                      Horario preferido
                    </label>
                    <form onSubmit={handleTextSubmit} className="space-y-3">
                      <Input
                        type="time"
                        value={pendingValue}
                        onChange={(event) => setPendingValue(event.target.value)}
                        className="h-12 rounded-2xl"
                      />
                      {alternatives.length > 0 && (
                        <div className="space-y-2">
                          <p className="font-inter text-xs text-dark-light">
                            Horario ocupado. Tente uma destas opcoes:
                          </p>
                          <div className="flex flex-wrap gap-2">
                            {alternatives.map((alternative) => (
                              <Button
                                key={alternative}
                                type="button"
                                variant="outline"
                                className="h-auto rounded-full border-slate-200 bg-white px-4 py-2 text-dark hover:border-coral hover:text-coral"
                                onClick={() => handleAlternative(alternative)}
                              >
                                {alternative}
                              </Button>
                            ))}
                          </div>
                        </div>
                      )}
                      <Button type="submit" className="w-full rounded-2xl bg-coral text-white hover:bg-coral-dark">
                        Avancar
                      </Button>
                    </form>
                  </div>
                )}

                {step === 'name' && (
                  <form onSubmit={handleTextSubmit} className="rounded-2xl border border-slate-200 bg-white p-3 shadow-sm">
                    <label className="mb-2 block font-inter text-xs font-semibold uppercase tracking-[0.08em] text-coral">
                      Nome completo
                    </label>
                    <Input
                      type="text"
                      placeholder="Seu nome"
                      value={pendingValue}
                      onChange={(event) => setPendingValue(event.target.value)}
                      className="h-12 rounded-2xl"
                    />
                    <Button type="submit" className="mt-3 w-full rounded-2xl bg-coral text-white hover:bg-coral-dark">
                      Avancar
                    </Button>
                  </form>
                )}

                {step === 'phone' && (
                  <form onSubmit={handleTextSubmit} className="rounded-2xl border border-slate-200 bg-white p-3 shadow-sm">
                    <label className="mb-2 block font-inter text-xs font-semibold uppercase tracking-[0.08em] text-coral">
                      Telefone
                    </label>
                    <Input
                      type="tel"
                      placeholder="(92) 99999-9999"
                      value={pendingValue}
                      onChange={(event) => setPendingValue(event.target.value)}
                      className="h-12 rounded-2xl"
                    />
                    <Button type="submit" className="mt-3 w-full rounded-2xl bg-coral text-white hover:bg-coral-dark">
                      Avancar
                    </Button>
                  </form>
                )}

                {step === 'notes' && (
                  <form onSubmit={handleTextSubmit} className="rounded-2xl border border-slate-200 bg-white p-3 shadow-sm">
                    <label className="mb-2 block font-inter text-xs font-semibold uppercase tracking-[0.08em] text-coral">
                      Observacao opcional
                    </label>
                    <Textarea
                      placeholder="Ex.: primeira consulta, dor, preferencia por horario..."
                      value={pendingValue}
                      onChange={(event) => setPendingValue(event.target.value)}
                      className="min-h-[110px] rounded-2xl"
                    />
                    <Button type="submit" className="mt-3 w-full rounded-2xl bg-coral text-white hover:bg-coral-dark">
                      Avancar
                    </Button>
                  </form>
                )}

                {step === 'review' && (
                  <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
                    <div className="mb-3 flex items-center gap-2 text-coral">
                      <CheckCircle2 className="h-5 w-5" />
                      <p className="font-inter text-xs font-semibold uppercase tracking-[0.08em]">
                        Confirmar agendamento
                      </p>
                    </div>

                    <div className="space-y-2">
                      {currentSummary.map((item) => (
                        <div key={item.label} className="flex items-start justify-between gap-3 rounded-2xl bg-offwhite px-3 py-2">
                          <span className="font-inter text-xs uppercase tracking-[0.08em] text-dark-muted">
                            {item.label}
                          </span>
                          <span className="text-right font-inter text-sm font-medium text-dark">
                            {item.value}
                          </span>
                        </div>
                      ))}
                    </div>

                    {error && (
                      <p className="mt-3 rounded-2xl border border-amber-200 bg-amber-50 px-3 py-2 font-inter text-sm text-amber-900">
                        {error}
                      </p>
                    )}

                    <div className="mt-4 flex flex-col gap-2">
                      <Button
                        type="button"
                        className="rounded-2xl bg-coral text-white hover:bg-coral-dark"
                        onClick={handleConfirm}
                        disabled={busy}
                      >
                        {busy ? 'Confirmando...' : 'Confirmar e agendar'}
                        <MoveRight className="ml-2 h-4 w-4" />
                      </Button>
                      <button
                        type="button"
                        onClick={() => openClinicScheduler()}
                        className="rounded-2xl border border-slate-200 px-4 py-3 font-inter text-sm font-semibold text-dark transition-colors hover:border-coral hover:text-coral"
                      >
                        Reabrir assistente
                      </button>
                    </div>
                  </div>
                )}

                {step === 'done' && (
                  <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-4 shadow-sm">
                    <div className="flex items-center gap-2 text-emerald-700">
                      <CheckCircle2 className="h-5 w-5" />
                      <p className="font-inter text-sm font-semibold">Agendamento confirmado</p>
                    </div>
                    <p className="mt-2 font-inter text-sm text-emerald-900">
                      Seu evento foi criado no calendario da clinica. Se precisar alterar, fale no WhatsApp.
                    </p>
                    <div className="mt-4">
                      <WhatsAppButton className="w-full justify-center">
                        Falar com a clinica
                      </WhatsAppButton>
                    </div>
                  </div>
                )}

                <div ref={scrollRef} />
              </div>
            </ScrollArea>

            <div className="border-t border-slate-200 bg-white px-4 py-3">
              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-2 font-inter text-xs text-dark-muted">
                  <Clock3 className="h-4 w-4 text-coral" />
                  Horarios: seg-sex 08h-18h | sab 08h-16h
                </div>
                <div className="flex items-center gap-2 font-inter text-xs text-dark-muted">
                  <Phone className="h-4 w-4 text-coral" />
                  Resposta rapida
                </div>
              </div>

              <div className="mt-3 flex items-center gap-2 text-xs text-dark-light">
                <MessageCircleMore className="h-4 w-4 text-coral" />
                <span>Voce fala com o assistente e o evento entra no Google Calendar da clinica.</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
