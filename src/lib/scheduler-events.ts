export const CLINIC_SCHEDULER_OPEN_EVENT = 'clinic-scheduler:open';

export function openClinicScheduler() {
  window.dispatchEvent(new Event(CLINIC_SCHEDULER_OPEN_EVENT));
}
