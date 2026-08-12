import { useCallback, useEffect, useRef } from 'react'

import { PassTimeslip } from './PassFallback'
import { useT } from '../../i18n'

type Props = {
  open: boolean
  onClose: () => void
}

export function PassTimeslipDialog({ open, onClose }: Props) {
  const t = useT()
  const dialogRef = useRef<HTMLDialogElement>(null)

  useEffect(() => {
    const dialog = dialogRef.current
    if (!dialog) return

    if (open && !dialog.open) {
      try {
        dialog.showModal()
      } catch {
        dialog.setAttribute('open', '')
      }
    } else if (!open && dialog.open) {
      dialog.close()
    }
  }, [open])

  useEffect(() => {
    if (!open) return
    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = previousOverflow
    }
  }, [open])

  const handleCancel = useCallback(
    (event: React.SyntheticEvent<HTMLDialogElement>) => {
      event.preventDefault()
      onClose()
    },
    [onClose],
  )

  const handleBackdropClick = useCallback(
    (event: React.MouseEvent<HTMLDialogElement>) => {
      if (event.target === event.currentTarget) {
        onClose()
      }
    },
    [onClose],
  )

  return (
    <dialog
      ref={dialogRef}
      className="pass-timeslip-dialog"
      aria-label={t.pass.timeslipTitle}
      onCancel={handleCancel}
      onClose={onClose}
      onClick={handleBackdropClick}
    >
      <div className="pass-timeslip-dialog__panel">
        <button
          type="button"
          className="pass-timeslip-dialog__close"
          onClick={onClose}
          aria-label={t.pass.closeTimeslip}
        >
          <span aria-hidden="true">×</span>
        </button>
        <div className="pass-timeslip-dialog__body">
          <PassTimeslip />
        </div>
      </div>
    </dialog>
  )
}
