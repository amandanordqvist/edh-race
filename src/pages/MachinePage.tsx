import { CarTurntable } from '../components/machine/CarTurntable'
import { InteractiveChassis } from '../components/machine/InteractiveChassis'
import { MachineNarrative } from '../components/machine/MachineNarrative'
import { SpecTable } from '../components/machine/SpecTable'
import { Reveal } from '../components/ui/Reveal'
import { Section } from '../components/ui/Section'
import { SkewDivider } from '../components/ui/SkewDivider'
import { useT } from '../i18n'
import './MachinePage.css'

export function MachinePage() {
  const t = useT()

  return (
    <div className="machine-page">
      <Section wide className="page-intro machine-page__intro">
        <Reveal>
          <h1 className="machine-page__title">{t.machine.title}</h1>
          <p className="machine-page__lead">{t.machine.intro}</p>
        </Reveal>
      </Section>

      <Reveal y={36}>
        <CarTurntable />
      </Reveal>

      <SkewDivider />
      <InteractiveChassis />
      <SkewDivider />
      <SpecTable />
      <SkewDivider />
      <MachineNarrative />
    </div>
  )
}
