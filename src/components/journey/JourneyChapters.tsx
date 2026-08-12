import { entriesForChapter, type TimelineChapter } from '../../data/timeline'
import { useT } from '../../i18n'
import { JourneyBeat } from './JourneyBeat'
import './JourneyChapters.css'

export function chapterDomId(chapter: TimelineChapter): string {
  return `chapter-${chapter}`
}

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
              <h2 id={headingId} className="journey-chapter__name">
                {t.journey.chapters[chapter]}
              </h2>
              <p className="journey-chapter__span">
                {entries[0]?.year}–{entries[entries.length - 1]?.year}
              </p>
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
