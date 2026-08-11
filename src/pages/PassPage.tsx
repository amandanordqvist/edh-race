import { useId } from 'react'

import { PassArena } from '../components/pass/PassArena'
import { useT } from '../i18n'
import './PassPage.css'

export default function PassPage() {
  const t = useT()
  const titleId = useId()

  return (
    <main className="pass-page" aria-labelledby={titleId}>
      <section className="pass-page__hero">
        <div className="pass-page__copy">
          <h1 id={titleId} className="pass-page__title">
            {t.pass.title}
          </h1>
          <p className="pass-page__lead">{t.pass.lead}</p>
        </div>

        <div className="pass-page__arena">
          <PassArena />
        </div>
      </section>
    </main>
  )
}
