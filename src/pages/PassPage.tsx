import { useId } from 'react'
import { useT } from '../i18n'
import './PassPage.css'

export default function PassPage() {
  const t = useT()
  const titleId = useId()

  return (
    <main className="pass-page" aria-labelledby={titleId}>
      <h1 id={titleId} className="pass-page__title">
        {t.pass.title}
      </h1>
      <p className="pass-page__lead">{t.pass.lead}</p>
    </main>
  )
}
