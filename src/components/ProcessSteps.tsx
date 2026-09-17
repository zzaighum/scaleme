export type ProcessStep = {
  title: string;
  body: string;
};

export function ProcessSteps({ steps }: { steps: ProcessStep[] }) {
  return (
    <ol className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
      {steps.map((step, index) => (
        <li
          key={step.title}
          className="rounded-2xl border border-border bg-surface p-6"
        >
          <span className="flex h-9 w-9 items-center justify-center rounded-full bg-primary text-sm font-semibold text-white">
            {index + 1}
          </span>
          <h3 className="mt-4 text-lg">{step.title}</h3>
          <p className="mt-2 text-base leading-7 text-muted-ink">{step.body}</p>
        </li>
      ))}
    </ol>
  );
}
