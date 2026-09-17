export function PageIntro({
  eyebrow,
  title,
  children,
}: {
  eyebrow?: string;
  title: string;
  children?: React.ReactNode;
}) {
  return (
    <div className="mx-auto max-w-[720px] text-center">
      {eyebrow ? (
        <p className="mb-4 text-sm font-semibold uppercase tracking-wide text-primary">
          {eyebrow}
        </p>
      ) : null}
      <h1 className="text-[38px] leading-[1.1] sm:text-[44px] md:text-[56px]">{title}</h1>
      {children ? <p className="mt-6 text-lg leading-8 text-muted-ink">{children}</p> : null}
    </div>
  );
}
