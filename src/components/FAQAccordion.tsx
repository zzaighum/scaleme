"use client";

import { useId, useState } from "react";
import type { Faq } from "@/data/faqs";

export function FAQAccordion({ items }: { items: Faq[] }) {
  const [open, setOpen] = useState<Set<number>>(new Set());
  const baseId = useId();

  function toggle(index: number) {
    setOpen((prev) => {
      const next = new Set(prev);
      if (next.has(index)) next.delete(index);
      else next.add(index);
      return next;
    });
  }

  return (
    <div className="divide-y divide-border rounded-2xl border border-border bg-surface">
      {items.map((item, index) => {
        const isOpen = open.has(index);
        const panelId = `${baseId}-panel-${index}`;
        const buttonId = `${baseId}-button-${index}`;
        return (
          <div key={item.question}>
            <h3>
              <button
                id={buttonId}
                type="button"
                aria-expanded={isOpen}
                aria-controls={panelId}
                onClick={() => toggle(index)}
                className="flex w-full min-h-[44px] items-center justify-between gap-4 px-6 py-5 text-left text-lg font-semibold text-ink"
              >
                {item.question}
                <span aria-hidden="true" className={`shrink-0 text-primary transition-transform duration-200 ${isOpen ? "rotate-45" : ""}`}>
                  +
                </span>
              </button>
            </h3>
            <div
              id={panelId}
              role="region"
              aria-labelledby={buttonId}
              hidden={!isOpen}
              className="px-6 pb-5 text-base leading-7 text-muted-ink"
            >
              {item.answer}
            </div>
          </div>
        );
      })}
    </div>
  );
}
