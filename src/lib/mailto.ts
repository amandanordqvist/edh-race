import { SITE } from '../data/site'

export type ContactFormValues = {
  name: string
  company: string
  email: string
  phone: string
  message: string
  interest: string
}

export function buildMailto(
  values: ContactFormValues,
  labels: {
    subject: string
    name: string
    company: string
    email: string
    phone: string
    interest: string
    message: string
  },
): string {
  const body = [
    `${labels.name}: ${values.name}`,
    `${labels.company}: ${values.company}`,
    `${labels.email}: ${values.email}`,
    `${labels.phone}: ${values.phone}`,
    `${labels.interest}: ${values.interest}`,
    '',
    `${labels.message}:`,
    values.message,
  ].join('\n')

  const params = new URLSearchParams({
    subject: labels.subject,
    body,
  })

  return `mailto:${SITE.email}?${params.toString().replace(/\+/g, '%20')}`
}
