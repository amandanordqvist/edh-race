import { type HudSplitId } from '../../data/simulator'
import { type Dictionary, useLocale, useT } from '../../i18n'
import { localePath } from '../../lib/paths'
import { Button } from '../ui/Button'
import { PassTimeslip } from './PassTimeslip'
import './PassArena.css'

export function getSplitCalloutText(t: Dictionary, id: HudSplitId) {
  switch (id) {
    case 'sixty':
      return t.pass.splitCallouts.sixty
    case 'threeThirty':
      return t.pass.splitCallouts.threeThirty
    case 'eighth':
      return t.pass.splitCallouts.eighth
    case 'thousand':
      return t.pass.splitCallouts.thousand
    case 'quarter':
      return t.pass.splitCallouts.quarter
    default: {
      const exhaustiveCheck: never = id
      return exhaustiveCheck
    }
  }
}

export function PassFallback() {
  const locale = useLocale()
  const t = useT()

  return (
    <div className="pass-fallback">
      <p className="pass-fallback__message" role="status">
        {t.pass.webglFallback}
      </p>
      <PassTimeslip />
      <div className="pass-fallback__actions">
        <Button to={localePath(locale, 'journey')} variant="ghost" icon>
          {t.pass.continueJourney}
        </Button>
      </div>
    </div>
  )
}
