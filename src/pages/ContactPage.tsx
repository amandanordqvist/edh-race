import { ContactCard } from '../components/contact/ContactCard'
import { ContactForm } from '../components/contact/ContactForm'
import { PartnerPitch } from '../components/contact/PartnerPitch'
import { SkewDivider } from '../components/ui/SkewDivider'
import './ContactPage.css'

export function ContactPage() {
  return (
    <div className="contact-page">
      <PartnerPitch />
      <SkewDivider />
      <div className="contact-page__connect">
        <ContactCard />
        <ContactForm />
      </div>
    </div>
  )
}
