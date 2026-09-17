export function QualificationList({ items }: { items: string[] }) {
  return (
    <ul className="grid gap-4 sm:grid-cols-2">
      {items.map((item) => (
        <li key={item} className="flex gap-3 rounded-xl border border-border bg-surface p-5">
          <span aria-hidden="true" className="mt-1 text-primary">
            ✓
          </span>
          <span className="text-base leading-7 text-ink">{item}</span>
        </li>
      ))}
    </ul>
  );
}
