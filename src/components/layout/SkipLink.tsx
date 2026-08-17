import { useT } from '../../i18n'

export function SkipLink() {
  const t = useT()
  return (
    <a className="skip-link" href="#main">
      {t.common.skipToContent}
    </a>
  )
}
