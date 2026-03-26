import type { LegalDocument } from "@/lib/legal-content";

export default function PolicyDocumentView({
  document,
  compact = false,
}: {
  document: LegalDocument;
  compact?: boolean;
}) {
  return (
    <div className="md:px-4">
      <div className="mb-10 border-b border-[#e2e8f0] pb-8">
        <span className="inline-flex items-center rounded-full border border-[#0EA5E9]/15 bg-[#0EA5E9]/5 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.22em] text-[#0EA5E9]">
          {document.eyebrow}
        </span>
        <h1 className={`${compact ? "text-xl md:text-2xl" : "text-3xl md:text-5xl"} mt-4 font-bold text-[#0f172a]`}>
          {document.title}
        </h1>
        <p className={`${compact ? "text-sm" : "text-base md:text-lg"} mt-3 max-w-3xl leading-relaxed text-[#64748b]`}>
          {document.intro}
        </p>
      </div>

      <div className="space-y-10 md:space-y-12">
        {document.sections.map((section) => (
          <section key={section.title}>
            <h2 className="text-xl md:text-2xl font-bold text-[#0f172a] mb-4">{section.title}</h2>

            {section.body && section.body.length > 0 && (
              <div className="space-y-4 text-base md:text-[17px] leading-8 text-[#475569]">
                {section.body.map((paragraph) => (
                  <p key={paragraph}>{paragraph}</p>
                ))}
              </div>
            )}

            {section.bullets && section.bullets.length > 0 && (
              <ul className="mt-5 space-y-3 text-base md:text-[17px] leading-8 text-[#475569]">
                {section.bullets.map((bullet) => (
                  <li key={bullet} className="flex gap-3">
                    <span className="mt-2.5 h-2 w-2 shrink-0 rounded-full bg-[#0EA5E9]" />
                    <span>{bullet}</span>
                  </li>
                ))}
              </ul>
            )}
          </section>
        ))}
      </div>
    </div>
  );
}
