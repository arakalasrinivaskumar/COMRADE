// supabase/functions/send-email/index.ts
import { serve } from "https://deno.land/std@0.224.0/http/server.ts";

/**
 * Edge Function that forwards a simple JSON payload to Resend's email API.
 * Expected JSON body:
 *   {
 *     "to": "recipient@example.com",
 *     "subject": "Subject line",
 *     "message": "Plain‑text body (\n newlines are converted to <br/>)."
 *   }
 *
 * The function expects a secret called `RESEND_API_KEY` in Supabase.
 */

serve(async (req) => {
  if (req.method !== "POST") {
    return new Response("Method Not Allowed", { status: 405 });
  }

  let payload: { to: string; subject: string; message: string };
  try {
    payload = await req.json();
  } catch (_) {
    return new Response(JSON.stringify({ error: "Invalid JSON" }), { status: 400 });
  }

  const { to, subject, message } = payload;
  if (!to || !subject || !message) {
    return new Response(JSON.stringify({ error: "Missing required fields" }), { status: 400 });
  }

  const resendPayload = {
    from: "noreply@your-domain.com", // replace with a verified sender in Resend dashboard
    to,
    subject,
    html: message.replace(/\n/g, "<br/>")
  };

  const apiKey = Deno.env.get("RESEND_API_KEY");
  if (!apiKey) {
    console.error("RESEND_API_KEY not set in Supabase secrets");
    return new Response(JSON.stringify({ error: "Server configuration error" }), { status: 500 });
  }

  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify(resendPayload),
  });

  const data = await res.json();
  if (!res.ok) {
    console.error("Resend error", data);
    return new Response(JSON.stringify({ error: data }), { status: 500 });
  }

  return new Response(JSON.stringify({ ok: true }), { status: 200 });
});
