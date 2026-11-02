import { useState } from 'react';
import { DemoFocusedSheet } from './components/DemoFocusedSheet';
import { StaffButton } from './components/staff/StaffButton';
import { StaffDrawer } from './components/staff/StaffDrawer';
import { DEMO_CLINIC_SHEET, type DemoClinicSheet } from './mock/clinicSheet';

export default function App() {
  const [open, setOpen] = useState(true);
  const [sheet, setSheet] = useState<DemoClinicSheet>(DEMO_CLINIC_SHEET);

  return (
    <div className="demo-stage min-h-screen">
      <div className="mx-auto flex max-w-3xl flex-col gap-4 px-6 py-16">
        <p className="text-sm font-semibold uppercase tracking-[0.14em] text-[var(--kahoots-ink)]/50">
          Staff UI demo
        </p>
        <h1 className="staff-display text-4xl text-[var(--kahoots-ink)] md:text-5xl">
          Teeth cleaning signup drawer
        </h1>
        <p className="max-w-xl text-base text-[var(--kahoots-ink)]/75">
          Static walkthrough of the focused clinic signup sheet — time slots, appointment chips, and
          receipt details. Placeholder data only; nothing is saved remotely.
        </p>
        <div>
          <StaffButton type="button" onClick={() => setOpen(true)}>
            Open clinic sheet
          </StaffButton>
        </div>
      </div>

      <StaffDrawer
        open={open}
        wide
        headerExtraSlot
        title={sheet.title}
        onClose={() => setOpen(false)}
      >
        <DemoFocusedSheet sheet={sheet} onSheetChange={setSheet} />
      </StaffDrawer>
    </div>
  );
}
