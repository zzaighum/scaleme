type Tone = "info" | "warning" | "success" | "neutral";

const tones: Record<Tone, string> = {
  info: "border-primary/30 bg-primary/5 text-ink",
  warning: "border-accent/40 bg-accent/10 text-ink",
  success: "border-primary/30 bg-primary/5 text-ink",
  neutral: "border-border bg-surface text-muted-ink",
};

export function Notice({
  tone = "info",
  title,
  children,
  className = "",
}: {
  tone?: Tone;
  title?: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      role="status"
      className={`rounded-xl border px-5 py-4 text-sm leading-6 ${tones[tone]} ${className}`}
    >
      {title ? <p className="mb-1 font-semibold">{title}</p> : null}
      <div>{children}</div>
    </div>
  );
}
