import { useLocale, useT } from '../../i18n'
import { localePath } from '../../lib/paths'
import { Button } from '../ui/Button'
import './PassClosing.css'

export function PassClosing() {
  const t = useT()
  const locale = useLocale()

  return (
    <section className="pass-closing" aria-labelledby="pass-closing-title">
      <div className="pass-closing__media" aria-hidden="true">
        <img src={encodeURI('/images/depå.JPEG')} alt="" width={1600} height={900} />
      </div>
      <div className="pass-closing__copy">
        <h2 id="pass-closing-title" className="pass-closing__title">
          {t.pass.closing.title}
        </h2>
        <p className="pass-closing__body">{t.pass.closing.body}</p>
        <Button to={localePath(locale, 'contact')} icon>
          {t.pass.closing.cta}
        </Button>
      </div>
    </section>
  )
}
