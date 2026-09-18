import {
  TargetIcon,
  UserBadgeIcon,
  ChatIcon,
  CheckBadgeIcon,
  ChannelIcon,
  GlobeIcon,
  LayersIcon,
  TagIcon,
  GearIcon,
} from "./Icon";

// Funnel stages, narrowest at the bottom — no numbers or percentages are
// attached to any of it; these are the qualitative stages described
// elsewhere on the page (see the homepage's "Know what happens" section),
// not a performance claim.
const stages = [
  { label: "Your IT offer", Icon: TargetIcon },
  { label: "Relevant accounts", Icon: UserBadgeIcon },
  { label: "Conversations", Icon: ChatIcon },
  { label: "Qualified handoff", Icon: CheckBadgeIcon },
];

const channelRing = [
  { slug: "cold-email", x: 78, y: 58 },
  { slug: "linkedin-outreach", x: 158, y: 28 },
  { slug: "cold-calling", x: 248, y: 28 },
  { slug: "marketplace-prospecting", x: 328, y: 58 },
];

// Honest facts in place of fabricated performance stats — structural facts
// about how the programme runs, not invented numbers or percentage deltas.
const factCards = [
  { Icon: GlobeIcon, title: "Worldwide", body: "Prospecting reach" },
  { Icon: LayersIcon, title: "4 channels", body: "Coordinated programme" },
  { Icon: TagIcon, title: "Quote-based", body: "Transparent terms" },
  { Icon: GearIcon, title: "End-to-end", body: "Research to reporting" },
];

const FUNNEL_CX = 200;
const FUNNEL_TOP = 95;
const BAND_HEIGHT = 60;
// Boundary widths top-to-bottom: 5 values bracket the 4 tapering bands.
const BOUNDARY_WIDTHS = [258, 198, 140, 86, 54];

export function ProcessIllustration() {
  return (
    <figure className="w-full">
      <svg
        viewBox="0 0 480 530"
        role="img"
        aria-labelledby="process-illustration-title"
        className="h-auto w-full"
      >
        <title id="process-illustration-title">
          How the programme connects: cold email, LinkedIn outreach, cold calling, and
          marketplace prospecting feed a single funnel from your IT offer to relevant accounts,
          to conversations, to a qualified handoff.
        </title>

        {/* decorative backdrop */}
        <circle cx="200" cy="220" r="195" fill="var(--color-primary)" opacity="0.05" />
        <circle
          cx="200"
          cy="220"
          r="160"
          fill="none"
          stroke="var(--color-primary)"
          strokeOpacity="0.15"
          strokeWidth="1.5"
        />

        {/* channel ring feeding the funnel */}
        {channelRing.map((channel) => (
          <g key={channel.slug}>
            <path
              d={`M ${channel.x} ${channel.y + 15} C ${channel.x} ${channel.y + 42}, ${channel.x} ${FUNNEL_TOP - 28}, ${channel.x} ${FUNNEL_TOP}`}
              fill="none"
              stroke="var(--color-primary)"
              strokeOpacity="0.3"
              strokeWidth="1.5"
              strokeDasharray="3 5"
            />
            <circle cx={channel.x} cy={channel.y} r="16" fill="var(--color-surface)" stroke="var(--color-border)" />
            <foreignObject x={channel.x - 9} y={channel.y - 9} width="18" height="18">
              <div className="flex h-[18px] w-[18px] items-center justify-center text-primary">
                <ChannelIcon slug={channel.slug} className="h-3 w-3" />
              </div>
            </foreignObject>
          </g>
        ))}

        {/* tapering funnel */}
        {stages.map((stage, i) => {
          const topW = BOUNDARY_WIDTHS[i];
          const botW = BOUNDARY_WIDTHS[i + 1];
          const y0 = FUNNEL_TOP + i * BAND_HEIGHT;
          const y1 = y0 + BAND_HEIGHT;
          const isLast = i === stages.length - 1;
          const path = `M ${FUNNEL_CX - topW / 2} ${y0} L ${FUNNEL_CX + topW / 2} ${y0} L ${FUNNEL_CX + botW / 2} ${y1} L ${FUNNEL_CX - botW / 2} ${y1} Z`;
          return (
            <g key={stage.label}>
              <path
                d={path}
                fill={isLast ? "var(--color-accent)" : "var(--color-primary)"}
                fillOpacity={isLast ? 1 : 1 - i * 0.18}
              />
              <circle cx={FUNNEL_CX} cy={(y0 + y1) / 2} r="16" fill="white" fillOpacity="0.15" />
              <foreignObject x={FUNNEL_CX - 9} y={(y0 + y1) / 2 - 9} width="18" height="18">
                <div className="flex h-[18px] w-[18px] items-center justify-center text-white">
                  <stage.Icon className="h-3.5 w-3.5" />
                </div>
              </foreignObject>
            </g>
          );
        })}

        {/* floating fact cards */}
        {factCards.map((card, i) => {
          const y = 90 + i * 100;
          return (
            <g key={card.title}>
              <rect x="330" y={y} width="140" height="82" rx="14" fill="var(--color-surface)" stroke="var(--color-border)" />
              <foreignObject x="348" y={y + 14} width="26" height="26">
                <div className="flex h-[26px] w-[26px] items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <card.Icon className="h-3.5 w-3.5" />
                </div>
              </foreignObject>
              <foreignObject x="348" y={y + 44} width="108" height="30">
                <div style={{ fontSize: "13px", fontWeight: 700, color: "var(--color-ink)", lineHeight: 1.2 }}>
                  {card.title}
                </div>
                <div style={{ fontSize: "10.5px", color: "var(--color-muted-ink)", lineHeight: 1.3, marginTop: 2 }}>
                  {card.body}
                </div>
              </foreignObject>
            </g>
          );
        })}

        {/* stage legend */}
        <foreignObject x="10" y="490" width="460" height="34">
          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              justifyContent: "center",
              gap: "6px 14px",
              fontSize: "11.5px",
              fontWeight: 600,
              color: "var(--color-muted-ink)",
              textAlign: "center",
            }}
          >
            {stages.map((stage, i) => (
              <span key={stage.label}>
                {stage.label}
                {i < stages.length - 1 ? <span style={{ color: "var(--color-primary)" }}> →</span> : null}
              </span>
            ))}
          </div>
        </foreignObject>
      </svg>

      <figcaption className="mt-4 text-center text-sm font-semibold text-muted-ink">
        How the programme connects
      </figcaption>

      {/* Text equivalent for screen readers, no-JS, and reduced-motion contexts */}
      <p className="sr-only">
        The process runs from your IT offer, to relevant accounts, to conversations, to a
        qualified handoff. Cold email, LinkedIn outreach, cold calling, and marketplace
        prospecting each feed into this process. The programme itself runs worldwide, across four
        coordinated channels, on quote-based terms, end to end from research to reporting.
      </p>
    </figure>
  );
}
