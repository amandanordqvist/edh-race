import { PartnerDesire } from '../components/contact/PartnerDesire'
import { PartnerHero } from '../components/contact/PartnerHero'
import { PartnerInvite } from '../components/contact/PartnerInvite'
import { PartnerRoster } from '../components/contact/PartnerRoster'
import { SkewDivider } from '../components/ui/SkewDivider'
import './ContactPage.css'

export function ContactPage() {
  return (
    <div className="contact-page">
      <PartnerHero />
      <PartnerRoster />
      <PartnerDesire />
      <SkewDivider />
      <PartnerInvite />
    </div>
  )
}
