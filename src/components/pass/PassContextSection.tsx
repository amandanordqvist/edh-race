import {
  EIGHTH_METERS,
  QUARTER_METERS,
  edhTimeslipMeta,
  hudSplitCallouts,
} from '../../data/simulator'
import { useLocale, useT } from '../../i18n'
import { formatLocaleNumber } from '../../lib/formatLocaleNumber'
import './PassContextSection.css'

const SIXTY_ET = hudSplitCallouts.find((split) => split.id === 'sixty')?.et ?? 0.9459
const EIGHTH_ET = hudSplitCallouts.find((split) => split.id === 'eighth')?.et ?? 3.8268
const EIGHTH_KMH = 326

export function PassContextSection() {
  const t = useT()
  const locale = useLocale()

  const marks = [
    {
      id: 'sixty' as const,
      value: formatLocaleNumber(SIXTY_ET, locale, 3),
      unit: 's',
      label: t.pass.progressMarks.sixty,
    },
    {
      id: 'eighth' as const,
      value: formatLocaleNumber(EIGHTH_ET, locale, 3),
      unit: 's',
      label: t.pass.progressMarks.eighth,
    },
    {
      id: 'quarter' as const,
      value: formatLocaleNumber(edhTimeslipMeta.et, locale, 4),
      unit: 's',
      label: t.pass.progressMarks.quarter,
      note: t.pass.anchors.time,
    },
    {
      id: 'trap' as const,
      value: `${edhTimeslipMeta.trapKmh}`,
      unit: 'km/h',
      label: t.pass.progressMarks.trap,
      note: t.pass.anchors.speed,
    },
  ]

  return (
    <section className="pass-context" aria-labelledby="pass-context-heading">
      <header className="pass-context__header">
        <h2 id="pass-context-heading" className="pass-context__title">
          {t.pass.anchorsTitle}
        </h2>
      </header>

      <ol className="pass-context__marks">
        {marks.map((mark) => (
          <li key={mark.id} className="pass-context__mark">
            <p className="pass-context__mark-value">
              <span className="pass-context__mark-kicker">{mark.value}</span>
              <span className="pass-context__mark-unit">{mark.unit}</span>
            </p>
            <p className="pass-context__mark-label">{mark.label}</p>
            {mark.note ? <p className="pass-context__mark-note">{mark.note}</p> : null}
          </li>
        ))}
      </ol>

      <div className="pass-context__split" aria-labelledby="pass-context-split-title">
        <h3 id="pass-context-split-title" className="pass-context__split-title">
          {t.pass.context201.title}
        </h3>
        <ul className="pass-context__lanes">
          <li className="pass-context__lane pass-context__lane--eighth">
            <span className="pass-context__lane-bar" aria-hidden="true" />
            <p className="pass-context__lane-distance">{`${EIGHTH_METERS} m`}</p>
            <p className="pass-context__lane-stats">
              <span>{`${formatLocaleNumber(EIGHTH_ET, locale, 4)} s`}</span>
              <span>{`${EIGHTH_KMH} km/h`}</span>
            </p>
          </li>
          <li className="pass-context__lane pass-context__lane--quarter">
            <span className="pass-context__lane-bar" aria-hidden="true" />
            <p className="pass-context__lane-distance">{`${QUARTER_METERS} m`}</p>
            <p className="pass-context__lane-stats">
              <span>{`${formatLocaleNumber(edhTimeslipMeta.et, locale, 4)} s`}</span>
              <span>{`${edhTimeslipMeta.trapKmh} km/h`}</span>
            </p>
          </li>
        </ul>
        <p className="pass-context__split-body">{t.pass.context201.body}</p>
        <p className="pass-context__split-note">{t.pass.anchors.distance}</p>
      </div>
    </section>
  )
}
