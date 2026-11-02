export type DemoAppointment = {
  id: number;
  aptId: number;
  customerName: string;
  email: string;
  phone: string;
  petName: string;
  pet: { nickname: string; breed?: string | null };
  receiptNumber: string | null;
  receiptSigned: boolean;
  transactionId: string | null;
  message?: string | null;
};

export type DemoTimeSlot = {
  id: number;
  startTime: string;
  endTime: string;
  appointments: DemoAppointment[];
};

export type DemoClinicSheet = {
  id: number;
  title: string;
  timeZone: string;
  maxAppointments: number;
  timeSlots: DemoTimeSlot[];
};

/** Placeholder clinic day matching the focused signup drawer walkthrough. */
export const DEMO_CLINIC_SHEET: DemoClinicSheet = {
  id: 101,
  title: 'Sample clinic — Nov 2',
  timeZone: 'America/Los_Angeles',
  maxAppointments: 12,
  timeSlots: [
    {
      id: 1,
      startTime: '2025-11-02T13:00:00-07:00',
      endTime: '2025-11-02T13:20:00-07:00',
      appointments: [
        {
          id: 9001,
          aptId: 9001,
          customerName: 'Client A',
          email: 'client.a@example.com',
          phone: '5550101001',
          petName: 'Pet A',
          pet: { nickname: 'Pet A', breed: 'Mixed breed' },
          receiptNumber: 'RCPT-1001',
          receiptSigned: true,
          transactionId: 'TX-1001',
          message: null,
        },
      ],
    },
    {
      id: 2,
      startTime: '2025-11-02T13:30:00-07:00',
      endTime: '2025-11-02T13:50:00-07:00',
      appointments: [
        {
          id: 9101,
          aptId: 9101,
          customerName: 'Client B',
          email: 'client.b@example.com',
          phone: '5550101002',
          petName: 'Pet B',
          pet: { nickname: 'Pet B', breed: 'Mixed breed' },
          receiptNumber: 'RCPT-1002',
          receiptSigned: true,
          transactionId: 'TX-1002',
          message: null,
        },
        {
          id: 9102,
          aptId: 9102,
          customerName: 'Client B',
          email: 'client.b@example.com',
          phone: '5550101002',
          petName: 'Pet C',
          pet: { nickname: 'Pet C', breed: 'Terrier mix' },
          receiptNumber: 'RCPT-1003',
          receiptSigned: false,
          transactionId: null,
          message: 'Second pet under same client',
        },
      ],
    },
    {
      id: 3,
      startTime: '2025-11-02T14:00:00-07:00',
      endTime: '2025-11-02T14:20:00-07:00',
      appointments: [],
    },
  ],
};

export function countBookedAppointments(sheet: DemoClinicSheet): number {
  return sheet.timeSlots.reduce((total, slot) => total + slot.appointments.length, 0);
}
