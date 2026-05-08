import { JWT } from 'google-auth-library';

const CALENDAR_SCOPE = 'https://www.googleapis.com/auth/calendar';
const DEFAULT_TIMEZONE = 'America/Manaus';
const DEFAULT_DURATION_MINUTES = 30;
const DEFAULT_LOCATION = 'Rua Indio Ajuricaba, 22, Zumbi dos Palmares, Manaus AM, 69086-397, Brasil';
const WORKING_HOURS = {
  0: null,
  1: { start: '08:00', end: '18:00' },
  2: { start: '08:00', end: '18:00' },
  3: { start: '08:00', end: '18:00' },
  4: { start: '08:00', end: '18:00' },
  5: { start: '08:00', end: '18:00' },
  6: { start: '08:00', end: '16:00' },
};

function readEnv(name) {
  const value = process.env[name];
  return typeof value === 'string' && value.trim() ? value.trim() : '';
}

function buildCredentials() {
  const raw = readEnv('GOOGLE_CREDENTIALS_JSON');
  if (raw) {
    return JSON.parse(raw);
  }

  const clientEmail = readEnv('GOOGLE_SERVICE_ACCOUNT_EMAIL');
  const privateKey = readEnv('GOOGLE_PRIVATE_KEY').replace(/\\n/g, '\n');

  if (!clientEmail || !privateKey) {
    return null;
  }

  return {
    client_email: clientEmail,
    private_key: privateKey,
  };
}

export function loadClinicConfig() {
  const calendarId = readEnv('GOOGLE_CALENDAR_ID');
  const timezone = readEnv('GOOGLE_CALENDAR_TIMEZONE') || DEFAULT_TIMEZONE;
  const clinicName = readEnv('GOOGLE_CLINIC_NAME') || 'Clinica Sorriso Novo';
  const location = readEnv('GOOGLE_CLINIC_LOCATION') || DEFAULT_LOCATION;
  const durationMinutes = Number.parseInt(readEnv('GOOGLE_APPOINTMENT_DURATION_MINUTES') || `${DEFAULT_DURATION_MINUTES}`, 10);

  const credentials = buildCredentials();

  return {
    calendarId,
    timezone,
    clinicName,
    location,
    durationMinutes: Number.isFinite(durationMinutes) && durationMinutes > 0 ? durationMinutes : DEFAULT_DURATION_MINUTES,
    credentials,
  };
}

export function isReady(config) {
  return Boolean(config.calendarId && config.credentials?.client_email && config.credentials?.private_key);
}

function createGoogleClient(config) {
  if (!config.credentials) {
    throw new Error('Credenciais do Google nao configuradas.');
  }

  return new JWT({
    email: config.credentials.client_email,
    key: config.credentials.private_key,
    scopes: [CALENDAR_SCOPE],
  });
}

function toIsoParts(date, time) {
  const [year, month, day] = date.split('-').map(Number);
  const [hours, minutes] = time.split(':').map(Number);
  return { year, month, day, hours, minutes };
}

function addMinutes(date, minutes) {
  return new Date(date.getTime() + minutes * 60 * 1000);
}

function formatTime(date) {
  return `${String(date.getUTCHours() - 4).padStart(2, '0')}:${String(date.getUTCMinutes()).padStart(2, '0')}`;
}

function formatClinicDateTime(date) {
  const local = new Date(date.getTime() - 4 * 60 * 60 * 1000);
  const year = local.getUTCFullYear();
  const month = String(local.getUTCMonth() + 1).padStart(2, '0');
  const day = String(local.getUTCDate()).padStart(2, '0');
  const hours = String(local.getUTCHours()).padStart(2, '0');
  const minutes = String(local.getUTCMinutes()).padStart(2, '0');
  return `${year}-${month}-${day}T${hours}:${minutes}:00`;
}

function getWorkingWindow(date) {
  const weekday = new Date(`${date}T12:00:00Z`).getUTCDay();
  return WORKING_HOURS[weekday];
}

function slotToDateTime(date, time) {
  const { year, month, day, hours, minutes } = toIsoParts(date, time);
  return new Date(Date.UTC(year, month - 1, day, hours + 4, minutes));
}

function overlaps(slotStart, slotEnd, busyPeriod) {
  const busyStart = new Date(busyPeriod.start);
  const busyEnd = new Date(busyPeriod.end);
  return slotStart < busyEnd && slotEnd > busyStart;
}

async function getAccessToken(client) {
  const token = await client.getAccessToken();
  if (typeof token === 'string') return token;
  if (token && typeof token === 'object' && 'token' in token && typeof token.token === 'string') {
    return token.token;
  }
  throw new Error('Nao foi possivel obter token de acesso do Google.');
}

async function googleFetch(client, url, init = {}) {
  const accessToken = await getAccessToken(client);
  const headers = {
    Authorization: `Bearer ${accessToken}`,
    'Content-Type': 'application/json',
    ...(init.headers || {}),
  };

  return fetch(url, {
    ...init,
    headers,
  });
}

async function queryBusyPeriods(client, calendarId, timeMin, timeMax, timezone) {
  const response = await googleFetch(client, 'https://www.googleapis.com/calendar/v3/freeBusy', {
    method: 'POST',
    body: JSON.stringify({
      timeMin,
      timeMax,
      timeZone: timezone,
      items: [{ id: calendarId }],
    }),
  });

  if (!response.ok) {
    throw new Error(`Google freeBusy retornou ${response.status}`);
  }

  const payload = await response.json();
  return payload.calendars?.[calendarId]?.busy ?? [];
}

async function isSlotBusy(client, calendarId, timezone, date, time, durationMinutes) {
  const start = slotToDateTime(date, time);
  const end = addMinutes(start, durationMinutes);
  const busyPeriods = await queryBusyPeriods(client, calendarId, start.toISOString(), end.toISOString(), timezone);
  return busyPeriods.some((busyPeriod) => overlaps(start, end, busyPeriod));
}

function nextBusinessSlots(date, time, durationMinutes) {
  const window = getWorkingWindow(date);
  if (!window) return [];

  const start = slotToDateTime(date, time);
  const current = new Date(start);
  const limit = slotToDateTime(date, window.end);
  const suggestions = [];

  while (current < limit && suggestions.length < 6) {
    current.setMinutes(current.getMinutes() + 30);
    const candidateEnd = addMinutes(current, durationMinutes);
    if (candidateEnd <= limit) {
      suggestions.push(formatTime(current));
    }
  }

  return suggestions;
}

function buildEventPayload(request, config) {
  const startDate = slotToDateTime(request.preferredDate, request.preferredTime);
  const endDate = addMinutes(startDate, config.durationMinutes);
  const start = formatClinicDateTime(startDate);
  const end = formatClinicDateTime(endDate);

  return {
    summary: `Consulta - ${request.patientName}`,
    location: config.location,
    description: [
      `Paciente: ${request.patientName}`,
      `Telefone: ${request.phone}`,
      `Atendimento: ${request.service}`,
      request.notes ? `Observacao: ${request.notes}` : '',
    ]
      .filter(Boolean)
      .join('\n'),
    start: {
      dateTime: start,
      timeZone: config.timezone,
    },
    end: {
      dateTime: end,
      timeZone: config.timezone,
    },
    guestsCanInviteOthers: false,
    guestsCanModify: false,
    guestsCanSeeOtherGuests: false,
    reminders: {
      useDefault: true,
    },
  };
}

export async function scheduleAppointment(request) {
  const config = loadClinicConfig();

  if (!isReady(config)) {
    return {
      ok: false,
      status: 503,
      body: {
        message: 'Integracao com Google Calendar nao configurada.',
        setupRequired: true,
      },
    };
  }

  const client = createGoogleClient(config);
  const window = getWorkingWindow(request.preferredDate);

  if (!window) {
    return {
      ok: false,
      status: 409,
      body: {
        message: 'A clinica nao atende neste dia.',
        alternatives: [],
      },
    };
  }

  const preferredStart = slotToDateTime(request.preferredDate, request.preferredTime);
  const dayStart = slotToDateTime(request.preferredDate, window.start);
  const dayEnd = slotToDateTime(request.preferredDate, window.end);
  const preferredEnd = addMinutes(preferredStart, config.durationMinutes);

  if (preferredStart < dayStart || preferredEnd > dayEnd) {
    return {
      ok: false,
      status: 409,
      body: {
        message: 'Horario fora do expediente da clinica.',
        alternatives: nextBusinessSlots(request.preferredDate, request.preferredTime, config.durationMinutes),
      },
    };
  }

  const busy = await isSlotBusy(client, config.calendarId, config.timezone, request.preferredDate, request.preferredTime, config.durationMinutes);
  if (busy) {
    return {
      ok: false,
      status: 409,
      body: {
        message: 'Horario ocupado no calendario da clinica.',
        alternatives: nextBusinessSlots(request.preferredDate, request.preferredTime, config.durationMinutes),
      },
    };
  }

  const payload = buildEventPayload(request, config);
  const response = await googleFetch(
    client,
    `https://www.googleapis.com/calendar/v3/calendars/${encodeURIComponent(config.calendarId)}/events`,
    {
      method: 'POST',
      body: JSON.stringify(payload),
    }
  );

  if (!response.ok) {
    const text = await response.text();
    return {
      ok: false,
      status: response.status,
      body: {
        message: `Falha ao criar evento no Google Calendar: ${text}`,
      },
    };
  }

  const event = await response.json();
  return {
    ok: true,
    status: 200,
    body: {
      message: 'Agendamento confirmado.',
      event: {
        id: event.id,
        htmlLink: event.htmlLink,
        summary: event.summary,
        start: event.start,
        end: event.end,
      },
    },
  };
}
