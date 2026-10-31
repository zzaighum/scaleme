export type ProcessStep = {
  title: string;
  body: string;
};

// `headingLevel` exists because these cards sit under a section h2 on the home
// page but directly under the h1 on /how-it-works/, where a fixed h3 skipped a
// level. The caller knows which it is; this component cannot.
export function ProcessSteps({
  steps,
  headingLevel = 3,
}: {
  steps: ProcessStep[];
  headingLevel?: 2 | 3;
}) {
  const Heading = headingLevel === 2 ? "h2" : "h3";
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
          <Heading className="mt-4 text-lg">{step.title}</Heading>
          <p className="mt-2 text-base leading-7 text-muted-ink">{step.body}</p>
        </li>
      ))}
    </ol>
  );
}
