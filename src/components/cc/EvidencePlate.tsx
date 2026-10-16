import Image, { type StaticImageData } from "next/image";
import { Link } from "@/i18n/navigation";

/**
 * Exhibition plate for real evidence (certificates now, lab screenshots later):
 * the artefact on a graphite mount with registration ticks, a catalogue number,
 * and a caption beneath. On hover or keyboard focus a scan line passes over the
 * artefact once. The whole plate is one link.
 */
export function EvidencePlate({
  href,
  image,
  alt,
  index,
  kind,
  kindLabel,
  title,
  meta,
  actionLabel,
  featured = false,
  sizes,
}: {
  href: string;
  image: StaticImageData;
  alt: string;
  index: string;
  kind: "certification" | "courseCompletion";
  kindLabel: string;
  title: string;
  meta: string;
  actionLabel: string;
  featured?: boolean;
  sizes: string;
}) {
  return (
    <Link href={href} className={`cc-plate group ${featured ? "cc-plate--featured" : ""}`} data-kind={kind}>
      <span className="cc-plate-mount">
        <span aria-hidden="true" className="cc-plate-ticks" />
        <span className="cc-plate-art">
          <Image src={image} alt={alt} sizes={sizes} placeholder="blur" className="cc-plate-img" />
          <span aria-hidden="true" className="cc-plate-scan" />
        </span>
      </span>
      <span className="cc-plate-caption">
        <span className="cc-plate-row">
          <span aria-hidden="true" className="cc-plate-index" dir="ltr">
            EX-{index}
          </span>
          <span className="cc-plate-kind" data-kind={kind}>
            {kindLabel}
          </span>
        </span>
        <span className="cc-plate-title">
          <bdi>{title}</bdi>
        </span>
        <span className="cc-plate-meta">{meta}</span>
        <span aria-hidden="true" className="cc-plate-action">
          {actionLabel}
          <span className="cc-plate-arrow">→</span>
        </span>
      </span>
    </Link>
  );
}
