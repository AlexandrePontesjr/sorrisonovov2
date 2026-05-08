import http from 'node:http';
import { z } from 'zod';
import { loadClinicConfig, scheduleAppointment } from './clinicCalendar.mjs';

const requestSchema = z.object({
  patientName: z.string().trim().min(2),
  phone: z.string().trim().min(8),
  service: z.string().trim().min(3),
  preferredDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  preferredTime: z.string().regex(/^\d{2}:\d{2}$/),
  notes: z.string().trim().optional().default(''),
});

const port = Number.parseInt(process.env.APPOINTMENT_API_PORT || '3001', 10);
const clinicConfig = loadClinicConfig();

function sendJson(response, statusCode, payload) {
  const body = JSON.stringify(payload);
  response.writeHead(statusCode, {
    'Content-Type': 'application/json; charset=utf-8',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'GET,POST,OPTIONS',
  });
  response.end(body);
}

function notFound(response) {
  sendJson(response, 404, {
    message: 'Rota nao encontrada.',
  });
}

function readBody(request) {
  return new Promise((resolve, reject) => {
    const chunks = [];
    request.on('data', (chunk) => chunks.push(chunk));
    request.on('end', () => {
      try {
        const raw = Buffer.concat(chunks).toString('utf8');
        resolve(raw ? JSON.parse(raw) : {});
      } catch (error) {
        reject(error);
      }
    });
    request.on('error', reject);
  });
}

const server = http.createServer(async (request, response) => {
  if (request.method === 'OPTIONS') {
    sendJson(response, 204, {});
    return;
  }

  const url = new URL(request.url || '/', `http://${request.headers.host || 'localhost'}`);

  if (request.method === 'GET' && url.pathname === '/api/health') {
    sendJson(response, 200, {
      ok: true,
      calendarConfigured: Boolean(clinicConfig.calendarId && clinicConfig.credentials),
      timezone: clinicConfig.timezone,
    });
    return;
  }

  if (request.method === 'POST' && url.pathname === '/api/appointments') {
    try {
      const payload = await readBody(request);
      const parsed = requestSchema.safeParse(payload);

      if (!parsed.success) {
        sendJson(response, 400, {
          message: parsed.error.issues[0]?.message ?? 'Dados invalidos.',
        });
        return;
      }

      const result = await scheduleAppointment(parsed.data);
      sendJson(response, result.status, result.body);
      return;
    } catch (error) {
      sendJson(response, 500, {
        message: error instanceof Error ? error.message : 'Erro inesperado.',
      });
      return;
    }
  }

  notFound(response);
});

server.listen(port, () => {
  const status = clinicConfig.calendarId && clinicConfig.credentials ? 'ready' : 'demo';
  console.log(`Appointment API listening on http://localhost:${port} (${status})`);
});
