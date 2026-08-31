import './SplitWords.css'

type Props = {
  text: string
  className?: string
}

export function SplitWords({ text, className = 'cinematic-word' }: Props) {
  return (
    <>
      {text.split(/(\s+)/).map((part, index) =>
        /^\s+$/.test(part) ? (
          <span key={index}>{part}</span>
        ) : (
          <span className={className} key={index}>
            {part}
          </span>
        ),
      )}
    </>
  )
}
