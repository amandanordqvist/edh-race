import { CROSSROADS_ID } from '../../data/timeline'
import { useT } from '../../i18n'
import { beatDomId } from './domIds'
import './JourneyCrossroads.css'

/**
 * 2016. The fastest year yet with the plate car, and the moment Anders sat
 * down and considered selling everything. Rendered as a full-width, 1:1
 * timeslip with every measurement cell empty. The dominant visual is the
 * year and the space around it.
 */
export function JourneyCrossroads() {
  const t = useT()

  return (
    <section
      id={beatDomId(CROSSROADS_ID)}
      className="journey-crossroads"
      aria-labelledby="journey-crossroads-title"
      data-beat=""
      data-weight="regular"
      data-outcome="setback"
    >
      <p className="journey-crossroads__label">{t.journey.crossroadsLabel}</p>

      <article
        className="journey-crossroads__slip"
        aria-label={t.journey.crossroadsLabel}
      >
        <header className="journey-crossroads__slip-header">
          <div>
            <p className="journey-crossroads__slip-eyebrow">
              {t.journey.timeslip.eyebrow}
            </p>
            <p className="journey-crossroads__slip-event">
              {t.journey.timeslip.event}
            </p>
          </div>
          <p className="journey-crossroads__slip-date">2016</p>
        </header>

        <h2
          id="journey-crossroads-title"
          className="journey-crossroads__year"
        >
          2016
        </h2>

        <dl className="journey-crossroads__grid">
          <div>
            <dt>{t.journey.timeslip.colDistance}</dt>
            <dd>—</dd>
          </div>
          <div>
            <dt>{t.journey.timeslip.colEt}</dt>
            <dd>—</dd>
          </div>
          <div>
            <dt>MPH</dt>
            <dd>—</dd>
          </div>
          <div>
            <dt>km/h</dt>
            <dd>—</dd>
          </div>
        </dl>

        <p className="journey-crossroads__caption">
          {t.journey.crossroadsCaption}
        </p>
      </article>

      <p className="journey-crossroads__body">{t.journey.crossroadsBody}</p>
    </section>
  )
}
