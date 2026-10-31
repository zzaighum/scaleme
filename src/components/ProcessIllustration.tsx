import {
  UsersIcon,
  CalendarIcon,
  HandshakeIcon,
  DollarIcon,
  ShareIcon,
  MailIcon,
  PhoneIcon,
  StorefrontIcon,
} from "./Icon";

/**
 * Hero funnel graphic, matched to the Figma hero frame (node 2:2).
 *
 * DEMO PLACEHOLDER DATA: the percentages and the figures in the floating
 * cards are reproduced from the Figma mockup so the implementation matches
 * it one-to-one. They are NOT real Your Leads Partner results. They only render while
 * the site is in preview mode (which also blocks indexing and shows the
 * site-wide "illustrative only" banner) — see LAUNCH_CHECKLIST.md before
 * switching NEXT_PUBLIC_SITE_MODE to "live".
 */

const CX = 228;

// Funnel boundaries, top to bottom: y, horizontal radius, ellipse depth.
// Three bands, not four: nothing records a "qualified" step between first
// contact and a booked meeting, so there is no number to put in one.
const BOUNDS = [
  { y: 140, rx: 162, ry: 30 },
  { y: 222, rx: 120, ry: 23 },
  { y: 304, rx: 86, ry: 16 },
  { y: 384, rx: 52, ry: 10 },
];

/*
 * Real counts, not percentages. 113 is the 120 lead records in Salesforce less
 * eight named "Unknown" (four with no contact details at all), two test rows
 * and the owner's own record. Meetings and closes were counted by hand from
 * email and Telegram, which is where those conversations happened.
 *
 * Percentages were considered and rejected: 9% to meeting and 4% to close read
 * worse than the counts do, and they hide the figure that matters, which is
 * five closed from ten meetings.
 */
const BANDS = [
  { id: "bandContacted", edge: "#0d4038", mid: "#1a6153", lip: "#0c3f37", label: "Contacted", value: "113", text: "#ffffff", Icon: UsersIcon, textY: 188, iconDx: -108, labelDx: -84, valueDx: 120 },
  { id: "bandMeetings", edge: "#55a888", mid: "#74c8a4", lip: "#55ab89", label: "Meetings", value: "10", text: "#0f3f36", Icon: CalendarIcon, textY: 270, iconDx: -74, labelDx: -50, valueDx: 84 },
  { id: "bandClosed", edge: "#b2dbc6", mid: "#d4f0e1", lip: "#b0dbc6", label: "Closed", value: "5", text: "#0f3f36", Icon: HandshakeIcon, textY: 352, iconDx: -46, labelDx: -24, valueDx: 52 },
];

// The four channels actually sold. The Figma mockup showed five — Website,
// Paid Ads and Referrals among them — none of which are services on offer, and
// it omitted two that are. `w` exists because "Marketplaces" does not fit the
// 54px square the shorter labels use.
const CHANNEL_CHIPS = [
  { label: "Email", x: 26, y: 74, w: 54, Icon: MailIcon, to: { x: 128, y: 118 } },
  { label: "LinkedIn", x: 130, y: 30, w: 58, Icon: ShareIcon, to: { x: 186, y: 111 } },
  { label: "Calling", x: 256, y: 30, w: 54, Icon: PhoneIcon, to: { x: 270, y: 111 } },
  { label: "Marketplaces", x: 352, y: 74, w: 74, Icon: StorefrontIcon, to: { x: 328, y: 118 } },
];

// The floating stat cards and the "+72% pipeline value" card are gone. Their
// "vs last month" deltas needed a prior period that was never recorded, and
// the pipeline figure had nothing behind it at all.

export function ProcessIllustration() {
  // No preview gate any more: every number here is counted from real records,
  // so it belongs on the live site too. The +72px shift centres the funnel on
  // the backdrop circle now that the floating cards are gone.
  const dx = 72;

  return (
    <figure className="w-full">
      <MobileFunnel />

      {/* The SVG scales with its container, and so does every fontSize in it.
          At 390px the viewBox renders at 0.565x, which put the channel labels
          at 4.8 CSS px and the card captions at 3.7 — unreadable. Rather than
          fight the scale, the phone gets the stacked version above and the
          drawing starts at the `md` breakpoint, where the smallest label is
          back above 9px. */}
      <div className="hidden md:block">
      <svg
        viewBox="0 0 620 580"
        role="img"
        aria-labelledby="hero-funnel-title"
        className="h-auto w-full"
        style={{ fontFamily: "var(--font-heading), ui-sans-serif, system-ui, sans-serif" }}
      >
        <title id="hero-funnel-title">
          {"A pipeline funnel: email, LinkedIn, calling and marketplace prospecting feed 113 contacted prospects, which narrow to 10 booked meetings and 5 closed deals worth about $100,000 in combined contract value. Counted from our own records, March to October 2026."}
        </title>

        <defs>
          <radialGradient id="funnelCircle" cx="35%" cy="30%" r="80%">
            <stop offset="0%" stopColor="#437c6a" />
            <stop offset="100%" stopColor="#2e6153" />
          </radialGradient>
          <marker id="arrowHead" markerWidth="6" markerHeight="6" refX="4.6" refY="3" orient="auto">
            <path d="M0 0.6 L5 3 L0 5.4 z" fill="#0f4d42" />
          </marker>
          <marker id="arrowHeadDown" markerWidth="7" markerHeight="7" refX="5" refY="3.5" orient="auto">
            <path d="M0 0.8 L6 3.5 L0 6.2 z" fill="#1f8f6d" />
          </marker>
          {BANDS.map((band) => (
            <linearGradient key={band.id} id={band.id} x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor={band.edge} />
              <stop offset="45%" stopColor={band.mid} />
              <stop offset="100%" stopColor={band.edge} />
            </linearGradient>
          ))}
        </defs>

        {/* concentric backdrop rings */}
        <circle cx="300" cy="300" r="276" fill="none" stroke="#cfe0d8" strokeWidth="1" />
        <circle cx="300" cy="300" r="262" fill="none" stroke="#cfe0d8" strokeWidth="1" />
        <circle cx="300" cy="300" r="248" fill="url(#funnelCircle)" />

        <g transform={`translate(${dx},0)`}>
        {/* acquisition channel chips feeding the funnel */}
        {CHANNEL_CHIPS.map((chip) => (
          <g key={chip.label}>
            <path
              d={`M ${chip.x + chip.w / 2} ${chip.y + 56} Q ${chip.x + chip.w / 2} ${chip.y + 86}, ${chip.to.x} ${chip.to.y}`}
              fill="none"
              stroke="#0f4d42"
              strokeWidth="1.8"
              markerEnd="url(#arrowHead)"
            />
            <rect x={chip.x} y={chip.y} width={chip.w} height="54" rx="12" fill="#ffffff" />
            <foreignObject x={chip.x + chip.w / 2 - 10} y={chip.y + 8} width="20" height="20">
              <div className="flex h-5 w-5 items-center justify-center text-primary">
                <chip.Icon className="h-[18px] w-[18px]" />
              </div>
            </foreignObject>
            <text
              x={chip.x + chip.w / 2}
              y={chip.y + 44}
              textAnchor="middle"
              fontSize="8.5"
              fontWeight="600"
              fill="#3c4f49"
            >
              {chip.label}
            </text>
          </g>
        ))}

        {/* funnel bands */}
        {BANDS.map((band, i) => {
          const top = BOUNDS[i];
          const bottom = BOUNDS[i + 1];
          return (
            <g key={band.label}>
              <path
                d={`M ${CX - top.rx} ${top.y} L ${CX + top.rx} ${top.y} L ${CX + bottom.rx} ${bottom.y} L ${CX - bottom.rx} ${bottom.y} Z`}
                fill={`url(#${band.id})`}
              />
              <ellipse cx={CX} cy={bottom.y} rx={bottom.rx} ry={bottom.ry} fill={band.lip} />
            </g>
          );
        })}

        {/* small motion accents flanking the funnel tip */}
        <g stroke="#2f9c76" strokeWidth="2.5" strokeLinecap="round" opacity="0.75">
          <path d={`M ${CX - 78} 352 l -13 -7`} />
          <path d={`M ${CX - 72} 368 l -15 0`} />
          <path d={`M ${CX - 66} 384 l -13 7`} />
          <path d={`M ${CX + 78} 352 l 13 -7`} />
          <path d={`M ${CX + 72} 368 l 15 0`} />
          <path d={`M ${CX + 66} 384 l 13 7`} />
        </g>

        {/* funnel rim sits above the top band */}
        <ellipse cx={CX} cy={BOUNDS[0].y} rx={BOUNDS[0].rx} ry={BOUNDS[0].ry} fill="#0d4239" />
        <ellipse cx={CX} cy={BOUNDS[0].y + 2} rx={BOUNDS[0].rx - 14} ry={BOUNDS[0].ry - 6} fill="#0a352e" />

        {/* band labels */}
        {BANDS.map((band) => (
          <g key={`${band.label}-label`}>
            <foreignObject x={CX + band.iconDx - 9} y={band.textY - 14} width="18" height="18">
              <div className="flex h-[18px] w-[18px] items-center justify-center" style={{ color: band.text }}>
                <band.Icon className="h-4 w-4" />
              </div>
            </foreignObject>
            <text x={CX + band.labelDx} y={band.textY} fontSize="15" fontWeight="600" fill={band.text}>
              {band.label}
            </text>
            <text
              x={CX + band.valueDx}
              y={band.textY}
              textAnchor="end"
              fontSize="13"
              fontWeight="600"
              fill={band.text}
              opacity="0.92"
            >
              {band.value}
            </text>
          </g>
        ))}

        {/* funnel outflow into the revenue pill */}
        <path d={`M ${CX} 396 L ${CX} 412`} stroke="#1f8f6d" strokeWidth="2.5" markerEnd="url(#arrowHeadDown)" />
        <rect x="136" y="420" width="196" height="46" rx="23" fill="#ffffff" />
        <circle cx="166" cy="443" r="15" fill="#1f8f6d" />
        <foreignObject x="157" y="434" width="18" height="18">
          <div className="flex h-[18px] w-[18px] items-center justify-center text-white">
            <DollarIcon className="h-[15px] w-[15px]" />
          </div>
        </foreignObject>
        <text x="192" y="449" fontSize="15" fontWeight="700" fill="#0f3f36">
          ~$100k deal value
        </text>
        </g>


      </svg>

      {/* Text equivalent for screen readers. Scoped to the same breakpoint as
          the drawing: below `md` the stacked version is already real text, and
          a second copy would just be read out twice. */}
      <p className="sr-only">
        Pipeline diagram. Four outreach channels — email, LinkedIn, calling and marketplace
        prospecting — feed 113 contacted prospects, narrowing to 10 booked meetings and 5
        closed deals worth about $100,000 in combined contract value.
      </p>
      </div>

      <figcaption className="mt-4 text-center text-sm leading-6 text-muted-ink">
        Direct outreach by email, LinkedIn, calling and marketplace prospecting, March to
        October 2026. Contacts counted from our CRM; meetings and closes counted from our
        own correspondence. Deal value is the combined contract value of the five closed
        deals, not revenue billed.
      </figcaption>
    </figure>
  );
}

/**
 * The phone rendering of the same pipeline: the five channels as chips, the
 * four funnel stages as rows that inset as they narrow, and the revenue end
 * state. Same data as the SVG, at type sizes a person can actually read.
 */
function MobileFunnel() {
  return (
    <div className="md:hidden">
      <ul className="flex flex-wrap justify-center gap-2">
        {CHANNEL_CHIPS.map((chip) => (
          <li key={chip.label}>
            <span className="inline-flex items-center gap-1.5 rounded-full border border-border bg-surface px-3 py-1.5 text-sm font-medium text-ink">
              <chip.Icon className="h-4 w-4 text-primary" />
              {chip.label}
            </span>
          </li>
        ))}
      </ul>

      <p className="mt-4 text-center text-sm text-muted-ink">
        feed one qualified pipeline
        <span aria-hidden="true" className="mt-1 block text-primary">
          ↓
        </span>
      </p>

      <ol className="mt-2 flex flex-col gap-2">
        {BANDS.map((band, index) => (
          <li
            key={band.id}
            className="flex items-center justify-between gap-3 rounded-xl border border-border bg-surface px-4 py-3"
            style={{ marginInline: index * 10 }}
          >
            <span className="flex items-center gap-2.5 text-base font-semibold text-ink">
              <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                <band.Icon className="h-4 w-4" />
              </span>
              {band.label}
            </span>
            <span className="text-base font-semibold text-muted-ink">{band.value}</span>
          </li>
        ))}
      </ol>

      <p className="mt-3 flex items-center justify-center gap-2 rounded-xl bg-primary px-4 py-3 text-base font-semibold text-white">
        <DollarIcon className="h-4 w-4" />
        ~$100k deal value
      </p>


    </div>
  );
}
