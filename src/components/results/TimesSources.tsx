import { timesSources } from '../../data/results'
import { useT } from '../../i18n'
import { Reveal } from '../ui/Reveal'
import { Section } from '../ui/Section'
import './TimesSources.css'

export function TimesSources() {
  const t = useT()

  return (
    <Section wide className="times-sources">
      <Reveal>
        <h2 className="results-section__heading">{t.results.sourcesTitle}</h2>
        <p className="results-section__lead">{t.results.sourcesLead}</p>
      </Reveal>

      <Reveal as="ul" className="times-sources__list" y={20}>
        {timesSources.map((source) => (
          <li key={source.id}>
            <a
              href={source.href}
              target="_blank"
              rel="noreferrer"
              className="times-sources__link"
            >
              <span className="times-sources__label">
                {t.results.sourceLabels[source.id]}
              </span>
              <span className="times-sources__host">{source.host}</span>
            </a>
          </li>
        ))}
      </Reveal>
    </Section>
  )
}
