const GP_EMAIL = 'wt@hmm.ventures';

const IM_REQUEST_BODY = [
  'Fund or office:',
  'Website:',
  'Your role:',
  'Mandate fit (one line):',
  '',
  'Anything else you would like me to know before I send:'
].join('\r\n');

export function buildContactMailto(subject: string, body?: string): string {
  // RFC 6068: spaces must be %20, not +. URLSearchParams uses + (form
  // encoding), which some mail clients render literally. Use
  // encodeURIComponent directly.
  const parts = [`subject=${encodeURIComponent(subject)}`];
  if (body) parts.push(`body=${encodeURIComponent(body)}`);
  return `mailto:${GP_EMAIL}?${parts.join('&')}`;
}

export function buildIMRequestMailto(): string {
  return buildContactMailto('IM request', IM_REQUEST_BODY);
}

export const CONTACT_EMAIL = GP_EMAIL;
