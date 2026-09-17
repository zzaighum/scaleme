const stages = [
  "Your IT offer",
  "Relevant accounts",
  "Conversations",
  "Qualified handoff",
];

const channels = ["Cold email", "LinkedIn outreach", "Cold calling", "Marketplace prospecting"];

export function ProcessIllustration() {
  return (
    <figure className="w-full">
      <svg
        viewBox="0 0 560 460"
        role="img"
        aria-labelledby="process-illustration-title"
        className="w-full h-auto"
      >
        <title id="process-illustration-title">
          How the programme connects: your IT offer leads to relevant accounts, then
          conversations, then a qualified handoff, fed by four outreach channels.
        </title>

        {/* main spine */}
        <line x1="70" y1="90" x2="470" y2="90" stroke="var(--color-border)" strokeWidth="3" />

        {stages.map((stage, i) => {
          const x = 70 + i * (400 / 3);
          return (
            <g key={stage}>
              <circle
                cx={x}
                cy="90"
                r="26"
                fill={i === stages.length - 1 ? "var(--color-accent)" : "var(--color-primary)"}
              />
              <text
                x={x}
                y="96"
                textAnchor="middle"
                fontSize="20"
                fontWeight="700"
                fill="white"
              >
                {i + 1}
              </text>
              <foreignObject x={x - 60} y="128" width="120" height="56">
                <div
                  style={{
                    fontSize: "13px",
                    lineHeight: 1.3,
                    textAlign: "center",
                    color: "var(--color-ink)",
                    fontWeight: 600,
                  }}
                >
                  {stage}
                </div>
              </foreignObject>
            </g>
          );
        })}

        {/* channel branches feeding into the spine */}
        {channels.map((channel, i) => {
          const branchX = 90 + i * 130;
          const targetX = Math.max(70, Math.min(470, branchX));
          return (
            <g key={channel}>
              <path
                d={`M ${branchX} 400 C ${branchX} 320, ${targetX} 260, ${targetX} 116`}
                fill="none"
                stroke="var(--color-primary)"
                strokeOpacity="0.35"
                strokeWidth="2"
                strokeDasharray="4 6"
              />
              <rect
                x={branchX - 58}
                y="404"
                width="116"
                height="44"
                rx="10"
                fill="var(--color-surface)"
                stroke="var(--color-border)"
              />
              <foreignObject x={branchX - 54} y="408" width="108" height="36">
                <div
                  style={{
                    fontSize: "12px",
                    lineHeight: 1.25,
                    textAlign: "center",
                    color: "var(--color-muted-ink)",
                    fontWeight: 600,
                  }}
                >
                  {channel}
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
