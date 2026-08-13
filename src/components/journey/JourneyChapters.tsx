import {
  chapterSpan,
  entriesForChapter,
  type TimelineChapter,
} from '../../data/timeline'
import { useT } from '../../i18n'
import { JourneyBeat } from './JourneyBeat'
import { chapterDomId } from './domIds'
import './JourneyChapters.css'

/**
 * Renders one or more chapters back-to-back. The page composes bookends and
 * the crossroads around these clusters, so this component only owns the
 * chapter shell and the beats inside it.
 */
export function JourneyChapters({
  chapters,
}: {
  chapters: readonly TimelineChapter[]
}) {
  const t = useT()

  return (
    <>
      {chapters.map((chapter) => {
        const entries = entriesForChapter(chapter)
        const headingId = `${chapterDomId(chapter)}-title`

        return (
          <section
            key={chapter}
            id={chapterDomId(chapter)}
            className="journey-chapter"
            aria-labelledby={headingId}
            data-chapter={chapter}
          >
            <header className="journey-chapter__head">
              <p className="journey-chapter__span">{chapterSpan(chapter)}</p>
              <h2 id={headingId} className="journey-chapter__name">
                {t.journey.chapters[chapter]}
              </h2>
            </header>

            <ol className="journey-chapter__beats">
              {entries.map((entry) => (
                <JourneyBeat key={entry.id} entry={entry} />
              ))}
            </ol>
          </section>
        )
      })}
    </>
  )
}
