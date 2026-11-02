# Teeth cleaning signup drawer — UI demo

A static, local-only walkthrough of the staff **clinic signup sheet drawer**: the right-hand panel staff use when they open a single dental clinic day and manage that day’s appointment grid.

This package is for design and stakeholder demos. It uses placeholder appointments and never talks to a backend.

## What the live UI is for

In the production staff app, this surface helps a store run one clinic day end to end:

1. **Open a focused drawer** for one clinic / signup sheet (clinic title in the header).
2. **Scan the day as a grid** — **Time Slot** down the left, **Appointments** on the right.
3. **Read bookings at a glance** from collapsed chips: receipt number, pet name, and whether the receipt is signed.
4. **Expand a slot with View details** to see customer name, contact info, pet / breed, receipt and transaction fields, and staff actions.
5. **Edit transaction / receipt data** from the detail card when numbers need correcting after checkout (in production those updates persist; in this demo they stay in browser memory).
6. **Header status** shows how full the sheet is (booked vs capacity) and whether the sheet is still editable. Print is present as chrome in the live product; here the Print control is a no-op.

Staff use this when the clinic is underway or when reviewing the day’s sheet — not as a marketing page.

## What this demo includes

- Wide cream staff drawer with frosted inner panel
- Time slot table and glass appointment chips
- Expand / collapse details
- Local-only receipt signed toggle and edit-transaction drawer
- Placeholder data inspired by a busy mid-afternoon slot (e.g. `#RCPT-1002` / `#RCPT-1003`)

## What this demo omits

- Authentication and store permissions
- Live booking, reschedule, cancel, or add-appointment flows
- Third-party systems, practice-management sync, payments, messaging, or analytics
- Live scheduling rules, capacity unlock logic, or clinic notes loading
- Any network calls — open DevTools → Network and you should see only the local Vite assets

## How to run

```bash
cd ~/Desktop/teeth-cleaning-slot-drawer-demo
npm install
npm run dev
```

Open the URL Vite prints (usually `http://localhost:5173`). The drawer opens on load; use **Open clinic sheet** if you close it.

Optional production build:

```bash
npm run build
npm run preview
```

## Try in the UI

1. Find the **1:30 PM to 1:50 PM** row with `#RCPT-1002 Pet B` and `#RCPT-1003 Pet C`.
2. Click **View details** to expand customer and receipt cards.
3. Toggle **Receipt signed?** / **Receipt signed**.
4. Click **Edit transaction**, change a field, and **Save** — the chip and detail card update locally only.
