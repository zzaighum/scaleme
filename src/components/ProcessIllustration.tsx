import { TargetIcon, UserBadgeIcon, ChatIcon, CheckBadgeIcon, ChannelIcon } from "./Icon";

const stages = [
  { label: "Your IT offer", Icon: TargetIcon },
  { label: "Relevant accounts", Icon: UserBadgeIcon },
  { label: "Conversations", Icon: ChatIcon },
  { label: "Qualified handoff", Icon: CheckBadgeIcon },
];

const channelChips = [
  { slug: "cold-email", label: "Cold email" },
  { slug: "linkedin-outreach", label: "LinkedIn outreach" },
  { slug: "cold-calling", label: "Cold calling" },
  { slug: "marketplace-prospecting", label: "Marketplace prospecting" },
];

export function ProcessIllustration() {
  return (
    <figure className="w-full">
      <svg
        viewBox="0 0 560 460"
        role="img"
        aria-labelledby="process-illustration-title"
        className="h-auto w-full"
      >
        <title id="process-illustration-title">
          How the programme connects: your IT offer leads to relevant accounts, then
          conversations, then a qualified handoff, fed by four outreach channels.
        </title>

        {/* decorative backdrop */}
        <circle cx="270" cy="90" r="230" fill="var(--color-primary)" opacity="0.05" />
        <circle
          cx="270"
          cy="90"
          r="190"
          fill="none"
          stroke="var(--color-primary)"
          strokeOpacity="0.15"
          strokeWidth="1.5"
        />

        {/* main spine */}
        <line x1="70" y1="90" x2="470" y2="90" stroke="var(--color-border)" strokeWidth="3" />

        {stages.map((stage, i) => {
          const x = 70 + i * (400 / 3);
          const isLast = i === stages.length - 1;
          return (
            <g key={stage.label}>
              <circle cx={x} cy="90" r="28" fill={isLast ? "var(--color-accent)" : "var(--color-primary)"} />
              <foreignObject x={x - 14} y="76" width="28" height="28">
                <div className="flex h-7 w-7 items-center justify-center text-white">
                  <stage.Icon className="h-4 w-4" />
                </div>
              </foreignObject>
              <foreignObject x={x - 60} y="130" width="120" height="56">
                <div
                  style={{
                    fontSize: "13px",
                    lineHeight: 1.3,
                    textAlign: "center",
                    color: "var(--color-ink)",
                    fontWeight: 600,
                  }}
                >
                  {stage.label}
                </div>
              </foreignObject>
            </g>
          );
        })}

        {/* channel chips feeding into the spine */}
        {channelChips.map((channel, i) => {
          const branchX = 90 + i * 130;
          const targetX = Math.max(70, Math.min(470, branchX));
          return (
            <g key={channel.slug}>
              <path
                d={`M ${branchX} 400 C ${branchX} 320, ${targetX} 260, ${targetX} 118`}
                fill="none"
                stroke="var(--color-primary)"
                strokeOpacity="0.35"
                strokeWidth="2"
                strokeDasharray="4 6"
              />
              <rect
                x={branchX - 58}
                y="400"
                width="116"
                height="48"
                rx="12"
                fill="var(--color-surface)"
                stroke="var(--color-border)"
              />
              <foreignObject x={branchX - 48} y="410" width="26" height="26">
                <div className="flex h-[26px] w-[26px] items-center justify-center rounded-md bg-primary/10 text-primary">
                  <ChannelIcon slug={channel.slug} className="h-3.5 w-3.5" />
                </div>
              </foreignObject>
              <foreignObject x={branchX - 16} y="408" width="76" height="34">
                <div
                  style={{
                    fontSize: "11.5px",
                    lineHeight: 1.2,
                    color: "var(--color-muted-ink)",
                    fontWeight: 600,
                  }}
                >
                  {channel.label}
                </div>
              </foreignObject>
            </g>
          );
        })}
      </svg>

      <figcaption className="mt-4 text-center text-sm font-semibold text-muted-ink">
        How the programme connects
      </figcaption>

      {/* Text equivalent for screen readers, no-JS, and reduced-motion contexts */}
      <p className="sr-only">
        The process runs from your IT offer, to relevant accounts, to conversations, to a
        qualified handoff. Cold email, LinkedIn outreach, cold calling, and marketplace
        prospecting each feed into this process.
      </p>
    </figure>
  );
}
