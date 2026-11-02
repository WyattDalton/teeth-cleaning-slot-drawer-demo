import { useEffect, useMemo, useState } from 'react';
import { createPortal } from 'react-dom';
import { DemoAppointmentRow } from './DemoAppointmentRow';
import { StaffButton } from './staff/StaffButton';
import {
  countBookedAppointments,
  type DemoClinicSheet,
} from '../mock/clinicSheet';

export function DemoFocusedSheet({
  sheet,
  onSheetChange,
}: {
  sheet: DemoClinicSheet;
  onSheetChange: (next: DemoClinicSheet) => void;
}) {
  const [drawerHeaderHost, setDrawerHeaderHost] = useState<Element | null>(null);

  useEffect(() => {
    setDrawerHeaderHost(document.querySelector('[data-staff-drawer-header-extra]'));
  }, []);

  const sortedSlots = useMemo(
    () =>
      [...sheet.timeSlots].sort(
        (a, b) => new Date(a.startTime).getTime() - new Date(b.startTime).getTime(),
      ),
    [sheet.timeSlots],
  );

  const booked = countBookedAppointments(sheet);
  const max = sheet.maxAppointments;

  const sheetStatusControls = (
    <>
      <span className="staff-pill staff-pill--selected-green">Editable</span>
      <span className="staff-pill">
        {booked} / {max} booked
      </span>
      <StaffButton type="button" variant="secondary" className="staff-btn--compact" onClick={() => undefined}>
        Print
      </StaffButton>
    </>
  );

  const updateTransaction = (appointmentId: number, patch: { transactionId: string; receiptNumber: string }) => {
    onSheetChange({
      ...sheet,
      timeSlots: sheet.timeSlots.map((slot) => ({
        ...slot,
        appointments: slot.appointments.map((app) =>
          app.id === appointmentId
            ? {
                ...app,
                transactionId: patch.transactionId || null,
                receiptNumber: patch.receiptNumber || null,
              }
            : app,
        ),
      })),
    });
  };

  const toggleReceiptSigned = (appointmentId: number) => {
    onSheetChange({
      ...sheet,
      timeSlots: sheet.timeSlots.map((slot) => ({
        ...slot,
        appointments: slot.appointments.map((app) =>
          app.id === appointmentId ? { ...app, receiptSigned: !app.receiptSigned } : app,
        ),
      })),
    });
  };

  return (
    <div className="staff-surface staff-surface--frosted overflow-visible rounded-2xl p-4">
      {drawerHeaderHost ? createPortal(sheetStatusControls, drawerHeaderHost) : null}
      <table className="w-full table-auto border-collapse overflow-hidden rounded-lg text-sm">
        <thead>
          <tr>
            <th className="staff-table-th min-w-max">Time Slot</th>
            <th className="staff-table-th w-full">Appointments</th>
          </tr>
        </thead>
        <tbody>
          {sortedSlots.map((slot) => (
            <DemoAppointmentRow
              key={slot.id}
              slot={slot}
              sheetTimeZone={sheet.timeZone}
              onUpdateTransaction={updateTransaction}
              onToggleReceiptSigned={toggleReceiptSigned}
            />
          ))}
        </tbody>
      </table>
    </div>
  );
}
