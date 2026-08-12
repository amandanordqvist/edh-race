import {
  edhTimeslipMeta,
  EIGHTH_METERS,
  QUARTER_METERS,
} from '../../data/simulator'
import { useT } from '../../i18n'
import './PassContextSection.css'

export function PassContextSection() {
  const t = useT()

  const tiles = [
    {
      id: 'distance' as const,
      kicker: `${QUARTER_METERS}`,
      unit: 'm',
      body: t.pass.anchors.distance,
    },
    {
      id: 'time' as const,
      kicker: edhTimeslipMeta.et.toFixed(2),
      unit: 's',
      body: t.pass.anchors.time,
    },
    {
      id: 'speed' as const,
      kicker: `${edhTimeslipMeta.trapKmh}`,
      unit: 'km/h',
      body: t.pass.anchors.speed,
    },
    {
      id: 'trap' as const,
      kicker: 'Trap',
      unit: '',
      body: t.pass.anchors.trap,
    },
  ]

  return (
    <section className="pass-context" aria-labelledby="pass-context-heading">
      <header className="pass-context__header">
        <p className="pass-context__eyebrow">{t.pass.anchorsTitle}</p>
        <h2 id="pass-context-heading" className="pass-context__title">
          {t.pass.sportWhy.title}
        </h2>
        <p className="pass-context__lead">{t.pass.sportWhy.body}</p>
      </header>

      <ul className="pass-context__tiles">
        {tiles.map((tile) => (
          <li key={tile.id} className="pass-context__tile">
            <p className="pass-context__tile-value">
              <span className="pass-context__tile-kicker">{tile.kicker}</span>
              {tile.unit ? (
                <span className="pass-context__tile-unit">{tile.unit}</span>
              ) : null}
            </p>
            <p className="pass-context__tile-body">{tile.body}</p>
          </li>
        ))}
      </ul>

      <div className="pass-context__split" aria-labelledby="pass-context-split-title">
        <div className="pass-context__split-copy">
          <p className="pass-context__eyebrow">{`${EIGHTH_METERS} m · ${QUARTER_METERS} m`}</p>
          <h3
            id="pass-context-split-title"
            className="pass-context__split-title"
          >
            {t.pass.context201.title}
          </h3>
          <p className="pass-context__split-body">{t.pass.context201.body}</p>
        </div>
        <ul className="pass-context__split-stats">
          <li className="pass-context__split-stat">
            <span className="pass-context__stat-tag">{`${EIGHTH_METERS} m`}</span>
            <p className="pass-context__stat-body">{t.pass.context201.edrsStat}</p>
          </li>
          <li className="pass-context__split-stat pass-context__split-stat--hero">
            <span className="pass-context__stat-tag">{`${QUARTER_METERS} m`}</span>
            <p className="pass-context__stat-body">{t.pass.context201.quarterStat}</p>
          </li>
        </ul>
      </div>
    </section>
  )
}
