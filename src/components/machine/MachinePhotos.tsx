import { machineHeroPhoto, machinePairPhotos, type MachinePhoto } from '../../data/machine'
import { useT } from '../../i18n'
import { Reveal } from '../ui/Reveal'
import { Section } from '../ui/Section'
import './MachinePhotos.css'

function Plate({
  photo,
  alt,
  eager,
  sizes,
}: {
  photo: MachinePhoto
  alt: string
  eager?: boolean
  sizes: string
}) {
  return (
    <picture>
      {photo.webpSrcSet ? (
        <source srcSet={photo.webpSrcSet} sizes={sizes} type="image/webp" />
      ) : (
        <source srcSet={photo.webp} type="image/webp" />
      )}
      <img
        src={photo.src}
        alt={alt}
        width={photo.width}
        height={photo.height}
        decoding="async"
        loading={eager ? 'eager' : 'lazy'}
      />
    </picture>
  )
}

export function MachinePhotos() {
  const t = useT()

  return (
    <Section wide className="machine-photos">
      <Reveal className="machine-photos__hero" variant="media" y={20} as="figure">
        <Plate
          photo={machineHeroPhoto}
          alt={t.machine.photoAlts[machineHeroPhoto.id]}
          eager
          sizes="(min-width: 900px) 80rem, 100vw"
        />
      </Reveal>

      <ul className="machine-photos__pair">
        {machinePairPhotos.map((photo, i) => (
          <Reveal
            key={photo.id}
            as="li"
            className={`machine-photos__shot machine-photos__shot--${photo.id}`}
            variant="media"
            delay={0.06 * (i + 1)}
            y={24}
          >
            <figure>
              <Plate
                photo={photo}
                alt={t.machine.photoAlts[photo.id]}
                sizes="(min-width: 800px) 40rem, 100vw"
              />
              {photo.credit ? (
                <figcaption className="machine-photos__credit">{photo.credit}</figcaption>
              ) : null}
            </figure>
          </Reveal>
        ))}
      </ul>
    </Section>
  )
}
