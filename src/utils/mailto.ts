const GP_EMAIL = 'wt@hmm.ventures';

const LP_INTRO_BODY = [
  'Office or fund:',
  'Website:',
  'Your role:',
  'A few lines on the mandate and what you have read:'
].join('\r\n');

export function buildContactMailto(subject: string, body?: string): string {
  // RFC 6068: spaces must be %20, not +. URLSearchParams uses + (form
  // encoding), which some mail clients render literally. Use
  // encodeURIComponent directly.
  const parts = [`subject=${encodeURIComponent(subject)}`];
  if (body) parts.push(`body=${encodeURIComponent(body)}`);
  return `mailto:${GP_EMAIL}?${parts.join('&')}`;
}

export function buildLpMeetingMailto(): string {
  return buildContactMailto('Request a meeting', LP_INTRO_BODY);
}

export const CONTACT_EMAIL = GP_EMAIL;
