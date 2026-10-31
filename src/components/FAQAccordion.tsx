import type { Faq } from "@/data/faqs";

/*
 * Native <details>/<summary> rather than a React toggle.
 *
 * The previous version kept open/closed state in a client component, so with
 * JavaScript disabled every panel stayed `hidden` and all nine answers on
 * /pricing/ were unreachable. <details> gives the same behaviour — keyboard
 * toggling, multiple panels open at once, content hidden when closed, and the
 * expanded state exposed to assistive technology — from the browser, with no
 * JavaScript and no "use client" boundary.
 *
 * The heading sits inside <summary>, which the HTML content model allows
 * ("phrasing content, optionally intermixed with heading content") and which
 * keeps the questions in the document outline. <summary> itself has to stay the
 * first child of <details>, so it cannot be nested inside the heading instead.
 */
export function FAQAccordion({
  items,
  headingLevel = 3,
}: {
  items: Faq[];
  headingLevel?: 2 | 3;
}) {
  const Heading = headingLevel === 2 ? "h2" : "h3";
  return (
    <div className="divide-y divide-border rounded-2xl border border-border bg-surface">
      {items.map((item) => (
        <details key={item.question} className="group">
          <summary className="flex min-h-[44px] cursor-pointer list-none items-center justify-between gap-4 px-6 py-5 text-left [&::-webkit-details-marker]:hidden">
            <Heading className="text-lg font-semibold text-ink">{item.question}</Heading>
            <span
              aria-hidden="true"
              className="shrink-0 text-primary transition-transform duration-200 group-open:rotate-45"
            >
              +
            </span>
          </summary>
          <div className="px-6 pb-5 text-base leading-7 text-muted-ink">{item.answer}</div>
        </details>
      ))}
    </div>
  );
}
