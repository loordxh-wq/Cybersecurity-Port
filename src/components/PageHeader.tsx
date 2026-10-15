import { SectionHeading } from "./SectionHeading";

/** Inner-page header: numbered eyebrow, large title and lead. */
export function PageHeader({ index, title, lead }: { index: string; title: string; lead: string }) {
  return (
    <header id="intro" data-section className="relative max-w-3xl">
      <SectionHeading
        index={index}
        as="h1"
        titleClassName="text-4xl font-semibold leading-[1.08] tracking-tight sm:text-6xl"
      >
        <span className="text-gradient inline-block">{title}</span>
      </SectionHeading>
      <p className="mt-6 text-lg leading-relaxed text-fg/85 sm:text-xl">{lead}</p>
    </header>
  );
}
