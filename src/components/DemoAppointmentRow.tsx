import { useId, useState } from 'react';
import { ChevronDownIcon, ReceiptSignedCheckIcon } from './icons';
import { StaffButton } from './staff/StaffButton';
import { StaffDrawer } from './staff/StaffDrawer';
import { StaffGlassCard } from './staff/StaffGlassCard';
import type { DemoAppointment, DemoTimeSlot } from '../mock/clinicSheet';

function formatSlotRange(startIso: string, endIso: string, timeZone: string): string {
  const start = new Date(startIso);
  const end = new Date(endIso);
  const opts: Intl.DateTimeFormatOptions = {
    hour: 'numeric',
    minute: '2-digit',
    timeZone,
  };
  return `${start.toLocaleTimeString('en-US', opts)} to ${end.toLocaleTimeString('en-US', opts)}`;
}

function formatPhone(raw: string): string {
  const digits = raw.replace(/\D/g, '');
  if (digits.length === 10) {
    return `(${digits.slice(0, 3)}) ${digits.slice(3, 6)}-${digits.slice(6)}`;
  }
  return raw;
}

function firstCleanString(...values: Array<string | null | undefined>): string | null {
  for (const value of values) {
    if (typeof value === 'string' && value.trim()) return value.trim();
  }
  return null;
}

type TransactionPatch = {
  transactionId: string;
  receiptNumber: string;
};

function TransactionDataModal({
  appointment,
  slot,
  sheetTimeZone,
  timeLabel,
  onSave,
}: {
  appointment: DemoAppointment;
  slot: DemoTimeSlot;
  sheetTimeZone: string;
  timeLabel: string;
  onSave: (appointmentId: number, patch: TransactionPatch) => void;
}) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formState, setFormState] = useState({
    transactionId: appointment.transactionId ?? '',
    receiptNumber: appointment.receiptNumber ?? '',
  });

  const hasSaved = Boolean(appointment.transactionId || appointment.receiptNumber);
  const petName = firstCleanString(appointment.pet?.nickname, appointment.petName) ?? 'Pet';

  const openModal = () => {
    setFormState({
      transactionId: appointment.transactionId ?? '',
      receiptNumber: appointment.receiptNumber ?? '',
    });
    setOpen(true);
  };

  const save = () => {
    if (loading) return;
    setLoading(true);
    // Local-only: no network. Brief delay so the busy state reads as a save.
    window.setTimeout(() => {
      onSave(appointment.id, {
        transactionId: formState.transactionId.trim(),
        receiptNumber: formState.receiptNumber.trim(),
      });
      setLoading(false);
      setOpen(false);
    }, 250);
  };

  return (
    <>
      <button type="button" onClick={openModal} className="text-sky-700 hover:underline">
        {hasSaved ? 'Edit transaction' : 'Add transaction'}
      </button>
      <StaffDrawer
        nested
        open={open}
        onClose={() => setOpen(false)}
        title="Teeth Cleaning Transaction Data"
        footer={
          <div className="flex justify-end gap-3">
            <StaffButton type="button" variant="secondary" onClick={() => setOpen(false)}>
              Nevermind
            </StaffButton>
            <StaffButton type="button" busy={loading} disabled={loading} onClick={save}>
              {loading ? 'Saving...' : 'Save'}
            </StaffButton>
          </div>
        }
      >
        <div className="rounded-lg border border-[var(--kahoots-border)] bg-white/70 px-3 py-2 text-sm text-[var(--kahoots-ink)]">
          <p className="font-semibold">{appointment.customerName}</p>
          <p className="text-xs text-[var(--kahoots-ink)]/70">
            {petName} · {timeLabel}
          </p>
          <p className="text-xs text-[var(--kahoots-ink)]/60">
            Slot {slot.id} · {sheetTimeZone}
          </p>
        </div>
        <div className="flex flex-col gap-3">
          <label className="flex flex-col gap-1 text-sm font-medium text-slate-700">
            Receipt Number
            <input
              type="text"
              value={formState.receiptNumber}
              onChange={(event) =>
                setFormState((previous) => ({ ...previous, receiptNumber: event.target.value }))
              }
              className="rounded-md border border-slate-300 px-3 py-2 text-sm font-normal text-slate-900 focus:border-sky-500 focus:outline-none"
            />
          </label>
          <label className="flex flex-col gap-1 text-sm font-medium text-slate-700">
            Transaction ID
            <input
              type="text"
              value={formState.transactionId}
              onChange={(event) =>
                setFormState((previous) => ({ ...previous, transactionId: event.target.value }))
              }
              className="rounded-md border border-slate-300 px-3 py-2 text-sm font-normal text-slate-900 focus:border-sky-500 focus:outline-none"
            />
          </label>
        </div>
      </StaffDrawer>
    </>
  );
}

export function DemoAppointmentRow({
  slot,
  sheetTimeZone,
  onUpdateTransaction,
  onToggleReceiptSigned,
}: {
  slot: DemoTimeSlot;
  sheetTimeZone: string;
  onUpdateTransaction: (appointmentId: number, patch: TransactionPatch) => void;
  onToggleReceiptSigned: (appointmentId: number) => void;
}) {
  const [detailsOpen, setDetailsOpen] = useState(false);
  const detailsId = useId();
  const appointments = slot.appointments;
  const timeLabel = formatSlotRange(slot.startTime, slot.endTime, sheetTimeZone);

  return (
    <tr>
      <td className="min-w-max whitespace-nowrap border border-[var(--kahoots-border)] px-2 py-1.5 align-top text-[var(--kahoots-ink)]">
        {timeLabel}
      </td>
      <td className="border border-[var(--kahoots-border)] px-2 py-1.5">
        <div className="flex flex-col gap-1.5">
          <StaffGlassCard seed={slot.id} className="flex items-center gap-2 px-2 py-1.5">
            {appointments.length > 0 ? (
              <button
                type="button"
                className="flex min-w-0 flex-1 flex-wrap items-center gap-1.5 text-left"
                aria-expanded={detailsOpen}
                aria-controls={detailsId}
                aria-label={detailsOpen ? 'Hide details' : 'View details'}
                onClick={() => setDetailsOpen((open) => !open)}
              >
                {appointments.map((app, index) => {
                  const petName = firstCleanString(app.pet?.nickname, app.petName) ?? 'Unknown pet';
                  const receiptNumber = firstCleanString(app.receiptNumber);
                  const signed = app.receiptSigned === true;
                  return (
                    <span
                      key={app.id ?? `${slot.id}-${index}`}
                      className="inline-flex items-center gap-1 rounded-full border border-slate-300 bg-white px-2 py-0.5 text-xs text-slate-800"
                    >
                      <span
                        className={signed ? 'text-emerald-700' : 'text-slate-400'}
                        title={signed ? 'Receipt signed' : 'Receipt not signed'}
                        aria-label={signed ? 'Receipt signed' : 'Receipt not signed'}
                      >
                        {signed ? (
                          <ReceiptSignedCheckIcon className="h-3 w-3" />
                        ) : (
                          <svg
                            className="h-3 w-3"
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2.5"
                            aria-hidden
                          >
                            <circle cx="12" cy="12" r="9" />
                          </svg>
                        )}
                      </span>
                      <span
                        className={receiptNumber ? 'text-slate-700' : 'text-slate-400'}
                        title={receiptNumber ? `Receipt ${receiptNumber}` : 'No receipt number'}
                        aria-label={receiptNumber ? `Receipt ${receiptNumber}` : 'No receipt number'}
                      >
                        #{receiptNumber || '—'}
                      </span>
                      <span className="font-medium">{petName}</span>
                    </span>
                  );
                })}
                <span className="ml-auto inline-flex shrink-0 items-center gap-1 text-xs font-medium text-[var(--kahoots-ink)]/70">
                  View details
                  <ChevronDownIcon
                    aria-hidden
                    className={`h-4 w-4 shrink-0 text-[var(--kahoots-ink)]/60 transition-transform ${detailsOpen ? 'rotate-180' : ''}`}
                  />
                </span>
              </button>
            ) : (
              <span className="flex-1 text-sm text-slate-500">No appointments</span>
            )}
          </StaffGlassCard>

          {detailsOpen && appointments.length > 0 ? (
            <div id={detailsId} className="staff-signup-details flex flex-wrap gap-1.5 p-2">
              {appointments.map((app, index) => {
                const petName = firstCleanString(app.pet?.nickname, app.petName) ?? 'Unknown pet';
                const breed =
                  app.pet?.breed != null && String(app.pet.breed).trim() !== ''
                    ? String(app.pet.breed).trim()
                    : null;
                const phone = formatPhone(app.phone);
                return (
                  <StaffGlassCard
                    key={app.id ?? `${slot.id}-${index}`}
                    seed={app.aptId ?? app.id ?? `${slot.id}-${index}`}
                    className="flex min-w-[220px] flex-1 flex-col gap-1 px-2 py-1.5"
                  >
                    <div>
                      <p className="text-sm font-semibold text-slate-900">{app.customerName}</p>
                      <p className="text-xs text-slate-700">
                        {petName}
                        {breed ? <span className="text-slate-600"> · {breed}</span> : null}
                      </p>
                      <p className="text-xs text-slate-600">
                        {app.email}
                        {app.email && phone ? ' | ' : ''}
                        {phone}
                      </p>
                      {(app.transactionId || app.receiptNumber) && (
                        <div className="mt-1 flex flex-col gap-0.5 text-xs text-slate-600">
                          {app.transactionId ? (
                            <p>
                              <span className="font-medium text-slate-700">Transaction ID:</span>{' '}
                              {app.transactionId}
                            </p>
                          ) : null}
                          {app.receiptNumber ? (
                            <p>
                              <span className="font-medium text-slate-700">Receipt Number:</span>{' '}
                              {app.receiptNumber}
                            </p>
                          ) : null}
                        </div>
                      )}
                      {app.message ? (
                        <p className="text-xs italic text-slate-600">&ldquo;{app.message}&rdquo;</p>
                      ) : null}
                      <div className="mt-1">
                        <button
                          type="button"
                          className={`staff-pill ${app.receiptSigned ? 'staff-pill--selected-green' : ''}`}
                          onClick={() => onToggleReceiptSigned(app.id)}
                        >
                          {app.receiptSigned ? 'Receipt signed' : 'Receipt signed?'}
                        </button>
                      </div>
                    </div>
                    <div className="flex flex-wrap items-center justify-start gap-4 text-sm">
                      <TransactionDataModal
                        appointment={app}
                        slot={slot}
                        sheetTimeZone={sheetTimeZone}
                        timeLabel={timeLabel}
                        onSave={onUpdateTransaction}
                      />
                    </div>
                  </StaffGlassCard>
                );
              })}
            </div>
          ) : null}
        </div>
      </td>
    </tr>
  );
}
