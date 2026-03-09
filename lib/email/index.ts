import { Resend } from "resend";

// ── Client ────────────────────────────────────────────────────────────────────
// Instantiated once per process. RESEND_API_KEY can be undefined during local
// dev before the key is set — Resend will throw at send time, not at init time.
const resend = new Resend(process.env.RESEND_API_KEY);

const FROM   = `Bella MediSpa <${process.env.RESEND_FROM_EMAIL ?? "noreply@bellamedispa.com"}>`;
const ADMIN  = process.env.ADMIN_NOTIFICATION_EMAIL
            ?? process.env.RESEND_FROM_EMAIL
            ?? "info@bellamedispa.com";

// ── Public send functions ─────────────────────────────────────────────────────

/**
 * Sends a booking confirmation to the client when a booking is confirmed.
 */
export async function sendBookingConfirmation(params: {
  to:          string;
  clientName:  string;
  serviceName: string;
  price:       number;
  slotStart:   string; // ISO datetime
  slotEnd:     string; // ISO datetime
  bookingId:   string;
}) {
  const { to, clientName, serviceName, price, slotStart, slotEnd, bookingId } = params;
  const start   = new Date(slotStart);
  const end     = new Date(slotEnd);
  const dateStr = start.toLocaleDateString("en-US", {
    weekday: "long", month: "long", day: "numeric", year: "numeric",
  });
  const timeStr = `${start.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" })} – ${end.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" })}`;

  await resend.emails.send({
    from:    FROM,
    to:      [to],
    subject: `Appointment Confirmed — ${serviceName} at Bella MediSpa`,
    html:    bookingConfirmationHtml({ clientName, serviceName, price, dateStr, timeStr, bookingId }),
  });
}

/**
 * Sends a new-booking alert to the admin/clinic inbox.
 */
export async function sendAdminNotification(params: {
  clientName:  string;
  clientEmail: string;
  serviceName: string;
  price:       number;
  slotStart:   string;
  bookingId:   string;
}) {
  const { clientName, clientEmail, serviceName, price, slotStart, bookingId } = params;
  const start = new Date(slotStart);
  const dateTimeStr = start.toLocaleString("en-US", {
    weekday: "short", month: "short", day: "numeric",
    hour: "numeric", minute: "2-digit",
  });

  await resend.emails.send({
    from:    FROM,
    to:      [ADMIN],
    subject: `New Booking: ${serviceName} — ${dateTimeStr}`,
    html:    adminNotificationHtml({ clientName, clientEmail, serviceName, price, dateTimeStr, bookingId }),
  });
}

/**
 * Forwards a contact-form submission to the admin inbox.
 * Sets reply-to as the visitor's email so the admin can reply directly.
 */
export async function sendContactEnquiry(params: {
  name:    string;
  email:   string;
  phone:   string;
  message: string;
}) {
  const { name, email, phone, message } = params;

  await resend.emails.send({
    from:     FROM,
    to:       [ADMIN],
    replyTo: email,
    subject:  `New Enquiry from ${name} — Bella MediSpa Website`,
    html:     contactEnquiryHtml({ name, email, phone, message }),
  });
}

// ── HTML templates ────────────────────────────────────────────────────────────
// Plain inline-style HTML for maximum email client compatibility.

const C = {
  brand: "#ef3825",
  cyan:  "#17a2b8",
  dark:  "#0F172A",
  slate: "#64748B",
  light: "#F8FAFC",
  muted: "rgba(255,255,255,0.4)",
} as const;

function wrap(body: string): string {
  return `<!DOCTYPE html>
<html lang="en">
<head><meta charset="utf-8"/><meta name="viewport" content="width=device-width,initial-scale=1"/></head>
<body style="margin:0;padding:0;background:#f1f5f9;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Helvetica,Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" role="presentation">
    <tr><td align="center" style="padding:40px 16px;">
      <table width="600" cellpadding="0" cellspacing="0" role="presentation" style="max-width:600px;width:100%;">
        <tr><td style="background:${C.dark};border-radius:16px 16px 0 0;padding:28px 36px;">
          <p style="margin:0;color:#fff;font-size:20px;font-weight:700;letter-spacing:0.3px;">
            Bella <span style="color:${C.brand};">MediSpa</span>
          </p>
          <p style="margin:4px 0 0;color:${C.muted};font-size:12px;">
            435 S Dupont Hwy · Dover, DE 19901
          </p>
        </td></tr>
        <tr><td style="background:#fff;padding:36px;border-left:1px solid #e2e8f0;border-right:1px solid #e2e8f0;">
          ${body}
        </td></tr>
        <tr><td style="background:${C.light};border-radius:0 0 16px 16px;border:1px solid #e2e8f0;border-top:none;padding:20px 36px;">
          <p style="margin:0;color:${C.slate};font-size:12px;text-align:center;">
            Bella MediSpa &nbsp;·&nbsp; 435 S Dupont Hwy, Dover, DE 19901 &nbsp;·&nbsp;
            <a href="tel:+13027366334" style="color:${C.cyan};text-decoration:none;">+1 302-736-6334</a>
          </p>
        </td></tr>
      </table>
    </td></tr>
  </table>
</body>
</html>`;
}

function row(label: string, value: string): string {
  return `<tr>
    <td style="padding:10px 0;border-bottom:1px solid #f1f5f9;">
      <span style="display:block;color:${C.slate};font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:0.8px;margin-bottom:3px;">${label}</span>
      <span style="color:${C.dark};font-size:14px;font-weight:500;">${value}</span>
    </td>
  </tr>`;
}

function bookingConfirmationHtml(p: {
  clientName:  string;
  serviceName: string;
  price:       number;
  dateStr:     string;
  timeStr:     string;
  bookingId:   string;
}): string {
  return wrap(`
    <h2 style="margin:0 0 8px;color:${C.dark};font-size:24px;font-weight:700;">
      Appointment Confirmed ✓
    </h2>
    <p style="margin:0 0 28px;color:${C.slate};font-size:15px;line-height:1.65;">
      Hi ${esc(p.clientName)}, your appointment at Bella MediSpa is confirmed.
      We look forward to seeing you!
    </p>

    <div style="background:${C.light};border-radius:12px;padding:20px 24px;margin-bottom:28px;">
      <table width="100%" cellpadding="0" cellspacing="0" role="presentation">
        ${row("Service",    esc(p.serviceName))}
        ${row("Date",       esc(p.dateStr))}
        ${row("Time",       esc(p.timeStr))}
        ${row("Total",      `$${p.price.toLocaleString()}`)}
        ${row("Booking ID", p.bookingId.slice(0, 8).toUpperCase())}
      </table>
    </div>

    <div style="background:#f0fdf4;border:1px solid #bbf7d0;border-radius:10px;padding:16px 20px;margin-bottom:28px;">
      <p style="margin:0 0 4px;color:#15803d;font-size:13px;font-weight:700;">Pre-Appointment Reminders</p>
      <p style="margin:0;color:#166534;font-size:13px;line-height:1.6;">
        Arrive with clean skin — no makeup. Avoid sun exposure and blood thinners (aspirin,
        ibuprofen, alcohol) for at least 5 days before injectables. If you need to reschedule,
        please give us at least 24 hours notice.
      </p>
    </div>

    <p style="margin:0;color:${C.slate};font-size:13px;line-height:1.6;">
      Questions? Call us at
      <a href="tel:+13027366334" style="color:${C.cyan};font-weight:600;text-decoration:none;">+1 302-736-6334</a>
      or reply to this email. We're open Mon–Sat, 9 AM – 6 PM.
    </p>
  `);
}

function adminNotificationHtml(p: {
  clientName:  string;
  clientEmail: string;
  serviceName: string;
  price:       number;
  dateTimeStr: string;
  bookingId:   string;
}): string {
  return wrap(`
    <h2 style="margin:0 0 8px;color:${C.dark};font-size:22px;font-weight:700;">
      New Booking Confirmed
    </h2>
    <p style="margin:0 0 24px;color:${C.slate};font-size:14px;">
      A new appointment has been confirmed.
    </p>

    <div style="background:${C.light};border-radius:12px;padding:20px 24px;">
      <table width="100%" cellpadding="0" cellspacing="0" role="presentation">
        ${row("Client",    esc(p.clientName))}
        ${row("Email",     `<a href="mailto:${esc(p.clientEmail)}" style="color:${C.cyan};text-decoration:none;">${esc(p.clientEmail)}</a>`)}
        ${row("Service",   esc(p.serviceName))}
        ${row("Date/Time", esc(p.dateTimeStr))}
        ${row("Revenue",   `$${p.price.toLocaleString()}`)}
        ${row("Booking ID", p.bookingId.slice(0, 8).toUpperCase())}
      </table>
    </div>
  `);
}

function contactEnquiryHtml(p: {
  name:    string;
  email:   string;
  phone:   string;
  message: string;
}): string {
  return wrap(`
    <h2 style="margin:0 0 8px;color:${C.dark};font-size:22px;font-weight:700;">
      New Website Enquiry
    </h2>
    <p style="margin:0 0 24px;color:${C.slate};font-size:14px;">
      A visitor submitted the contact form on bellamedispa.com.
    </p>

    <div style="background:${C.light};border-radius:12px;padding:20px 24px;margin-bottom:20px;">
      <table width="100%" cellpadding="0" cellspacing="0" role="presentation">
        ${row("Name",  esc(p.name))}
        ${row("Email", `<a href="mailto:${esc(p.email)}" style="color:${C.cyan};text-decoration:none;">${esc(p.email)}</a>`)}
        ${p.phone ? row("Phone", `<a href="tel:${esc(p.phone)}" style="color:${C.cyan};text-decoration:none;">${esc(p.phone)}</a>`) : ""}
      </table>
    </div>

    <div style="background:#fff;border:1px solid #e2e8f0;border-radius:10px;padding:20px;">
      <p style="margin:0 0 10px;color:${C.slate};font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:0.8px;">
        Message
      </p>
      <p style="margin:0;color:${C.dark};font-size:14px;line-height:1.75;white-space:pre-wrap;">${esc(p.message)}</p>
    </div>

    <p style="margin:20px 0 0;color:${C.slate};font-size:12px;">
      Reply directly to this email to respond to ${esc(p.name)}.
    </p>
  `);
}

/** Minimal HTML escaping to prevent injection in email templates. */
function esc(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}
