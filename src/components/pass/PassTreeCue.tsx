import { useEffect, useState } from 'react'

import { useT } from '../../i18n'
import type { PassPhase } from '../../lib/pass/types'

type Props = {
  phase: PassPhase
}

export function PassTreeCue({ phase }: Props) {
  const t = useT()
  const [staged, setStaged] = useState(false)

  useEffect(() => {
    setStaged(false)
    if (phase !== 'staging') return
    const timer = window.setTimeout(() => setStaged(true), 520)
    return () => window.clearTimeout(timer)
  }, [phase])

  let label: string
  switch (phase) {
    case 'staging':
      label = staged ? t.pass.treeCue.stage : t.pass.treeCue.preStage
      break
    case 'amber':
      label = t.pass.treeCue.amber
      break
    case 'green':
      label = t.pass.treeCue.green
      break
    case 'idle':
    case 'racing':
    case 'finished':
      return null
    default: {
      const exhaustiveCheck: never = phase
      return exhaustiveCheck
    }
  }

  return (
    <p className={`pass-tree-cue pass-tree-cue--${phase}`} aria-live="polite">
      {label}
    </p>
  )
}
