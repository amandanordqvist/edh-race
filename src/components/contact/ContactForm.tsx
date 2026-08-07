import { useState, type FormEvent } from 'react'
import { useT } from '../../i18n'
import { buildMailto, type ContactFormValues } from '../../lib/mailto'
import { Button } from '../ui/Button'
import { Reveal } from '../ui/Reveal'
import { Section } from '../ui/Section'
import './ContactForm.css'

const initial: ContactFormValues = {
  name: '',
  company: '',
  email: '',
  phone: '',
  message: '',
  interest: 'main',
}

export function ContactForm() {
  const t = useT()
  const [values, setValues] = useState<ContactFormValues>(initial)

  function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const interestLabel =
      t.contact.interestOptions[
        values.interest as keyof typeof t.contact.interestOptions
      ] ?? values.interest

    const href = buildMailto(
      { ...values, interest: interestLabel },
      {
        subject: t.contact.mailtoSubject,
        name: t.contact.name,
        company: t.contact.company,
        email: t.contact.email,
        phone: t.contact.phone,
        interest: t.contact.interest,
        message: t.contact.message,
      },
    )

    window.location.href = href
  }

  return (
    <Section className="contact-form-section">
      <Reveal>
        <div className="contact-form">
          <h2 className="contact-form__title">{t.contact.formTitle}</h2>
          <form onSubmit={onSubmit}>
            <div className="contact-form__grid">
              <label>
                {t.contact.name}
                <input
                  required
                  name="name"
                  value={values.name}
                  onChange={(e) => setValues({ ...values, name: e.target.value })}
                />
              </label>
              <label>
                {t.contact.company}
                <input
                  required
                  name="company"
                  value={values.company}
                  onChange={(e) =>
                    setValues({ ...values, company: e.target.value })
                  }
                />
              </label>
              <label>
                {t.contact.email}
                <input
                  required
                  type="email"
                  name="email"
                  value={values.email}
                  onChange={(e) => setValues({ ...values, email: e.target.value })}
                />
              </label>
              <label>
                {t.contact.phone}
                <input
                  name="phone"
                  value={values.phone}
                  onChange={(e) => setValues({ ...values, phone: e.target.value })}
                />
              </label>
            </div>
            <label>
              {t.contact.interest}
              <select
                name="interest"
                value={values.interest}
                onChange={(e) => setValues({ ...values, interest: e.target.value })}
              >
                {Object.entries(t.contact.interestOptions).map(([key, label]) => (
                  <option key={key} value={key}>
                    {label}
                  </option>
                ))}
              </select>
            </label>
            <label>
              {t.contact.message}
              <textarea
                required
                name="message"
                rows={5}
                value={values.message}
                onChange={(e) => setValues({ ...values, message: e.target.value })}
              />
            </label>
            <Button type="submit" icon>
              {t.contact.submit}
            </Button>
          </form>
        </div>
      </Reveal>
    </Section>
  )
}
