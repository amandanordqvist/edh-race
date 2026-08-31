import { edhTimeslipMeta } from '../../data/simulator'
import { useLocale, useT } from '../../i18n'
import { formatLocaleNumber } from '../../lib/formatLocaleNumber'
import { Button } from '../ui/Button'

type Props = {
  onAgain: () => void
  onTimeslip: () => void
}

export function PassFinishBeat({ onAgain, onTimeslip }: Props) {
  const t = useT()
  const locale = useLocale()

  return (
    <div className="pass-finish-beat" role="group" aria-label={t.pass.status.finished}>
      <p className="pass-finish-beat__et">
        {formatLocaleNumber(edhTimeslipMeta.et, locale, 4)}
        <span> s</span>
      </p>
      <p className="pass-finish-beat__line">{t.pass.thatWasThePass}</p>
      <p className="pass-finish-beat__trap">
        {formatLocaleNumber(edhTimeslipMeta.trapKmh, locale, 0)} km/h
      </p>
      <p className="pass-finish-beat__venue">{t.pass.finishVenue}</p>
      <div className="pass-finish-beat__actions">
        <Button className="pass-arena__stage" onClick={onTimeslip}>
          {t.pass.seeTimeslip}
        </Button>
        <Button className="pass-arena__finish-secondary" variant="ghost" onClick={onAgain}>
          {t.pass.again}
        </Button>
      </div>
    </div>
  )
}
