import { useT } from '../../i18n'
import { Reveal } from '../ui/Reveal'
import { Section } from '../ui/Section'
import { ContactCard } from './ContactCard'
import { ContactForm } from './ContactForm'
import './PartnerInvite.css'

export function PartnerInvite() {
  const t = useT()

  return (
    <Section wide className="partner-invite" id="invite">
      <Reveal className="partner-invite__head" pace="settle">
        <h2 className="partner-invite__title">{t.contact.formTitle}</h2>
        <p className="partner-invite__hint">{t.contact.formHint}</p>
      </Reveal>
      <div className="partner-invite__grid">
        <ContactCard />
        <ContactForm />
      </div>
    </Section>
  )
}
