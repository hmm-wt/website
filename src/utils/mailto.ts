const GP_EMAIL = 'wt@hmm.ventures';

const IM_REQUEST_BODY = [
  'Fund or office:',
  'Website:',
  'Your role:',
  'Mandate fit (one line):',
  '',
  'Anything else you would like me to know before I send:'
].join('\n');

export function buildContactMailto(subject: string, body?: string): string {
  const params = new URLSearchParams();
  params.set('subject', subject);
  if (body) params.set('body', body);
  return `mailto:${GP_EMAIL}?${params.toString()}`;
}

export function buildIMRequestMailto(): string {
  return buildContactMailto('IM request', IM_REQUEST_BODY);
}

export const CONTACT_EMAIL = GP_EMAIL;
