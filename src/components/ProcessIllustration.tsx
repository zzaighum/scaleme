import {
  UsersIcon,
  SearchIcon,
  CalendarIcon,
  HandshakeIcon,
  DollarIcon,
  ShareIcon,
  MailIcon,
  GlobeIcon,
  TargetIcon,
} from "./Icon";
import { siteConfig } from "@/config/site";

/**
 * Hero funnel graphic, matched to the Figma hero frame (node 2:2).
 *
 * DEMO PLACEHOLDER DATA: the percentages and the figures in the floating
 * cards are reproduced from the Figma mockup so the implementation matches
 * it one-to-one. They are NOT real YourLeadsPartner results. They only render while
 * the site is in preview mode (which also blocks indexing and shows the
 * site-wide "illustrative only" banner) — see LAUNCH_CHECKLIST.md before
 * switching NEXT_PUBLIC_SITE_MODE to "live".
 */

const CX = 228;

// Funnel boundaries, top to bottom: y, horizontal radius, ellipse depth.
const BOUNDS = [
  { y: 140, rx: 162, ry: 30 },
  { y: 218, rx: 128, ry: 24 },
  { y: 282, rx: 99, ry: 18 },
  { y: 336, rx: 74, ry: 14 },
  { y: 384, rx: 52, ry: 10 },
];

const BANDS = [
  { id: "bandLeads", edge: "#0d4038", mid: "#1a6153", lip: "#0c3f37", label: "Leads", value: "100%", text: "#ffffff", Icon: UsersIcon, textY: 190, iconDx: -108, labelDx: -84, valueDx: 132 },
  { id: "bandQualified", edge: "#17795b", mid: "#29a37d", lip: "#178160", label: "Qualified", value: "60%", text: "#ffffff", Icon: SearchIcon, textY: 255, iconDx: -84, labelDx: -60, valueDx: 104 },
  { id: "bandMeetings", edge: "#55a888", mid: "#74c8a4", lip: "#55ab89", label: "Meetings", value: "30%", text: "#0f3f36", Icon: CalendarIcon, textY: 312, iconDx: -62, labelDx: -40, valueDx: 80 },
  { id: "bandClosed", edge: "#b2dbc6", mid: "#d4f0e1", lip: "#b0dbc6", label: "Closed", value: "10%", text: "#0f3f36", Icon: HandshakeIcon, textY: 362, iconDx: -44, labelDx: -24, valueDx: 58 },
];

const CHANNEL_CHIPS = [
  { label: "LinkedIn", x: 14, y: 80, Icon: ShareIcon, to: { x: 118, y: 126 } },
  { label: "Email", x: 94, y: 44, Icon: MailIcon, to: { x: 156, y: 118 } },
  { label: "Website", x: 182, y: 22, Icon: GlobeIcon, to: { x: 206, y: 111 } },
  { label: "Paid Ads", x: 270, y: 20, Icon: TargetIcon, to: { x: 266, y: 112 } },
  { label: "Referrals", x: 350, y: 44, Icon: UsersIcon, to: { x: 316, y: 122 } },
];

const STAT_CARDS = [
  { y: 262, Icon: UsersIcon, value: "1,250", label: "New Leads", delta: "↑ 40%" },
  { y: 320, Icon: CalendarIcon, value: "375", label: "Meetings Booked", delta: "↑ 52%" },
  { y: 378, Icon: HandshakeIcon, value: "89", label: "Deals Closed", delta: "↑ 28%" },
];

const CARD_X = 374;

const PIPELINE_BARS = [12, 18, 23, 30, 38, 47];

export function ProcessIllustration() {
  // Hard gate: the mockup figures exist only in preview. Flipping
  // NEXT_PUBLIC_SITE_MODE to "live" drops them rather than publishing
  // invented numbers, and re-centres the funnel to fill the space.
  const showDemoFigures = siteConfig.siteMode === "preview";
  const dx = showDemoFigures ? 0 : 72;

  return (
    <figure className="w-full">
      <svg
        viewBox="0 0 620 580"
        role="img"
        aria-labelledby="hero-funnel-title"
        className="h-auto w-full"
        style={{ fontFamily: "var(--font-heading), ui-sans-serif, system-ui, sans-serif" }}
      >
        <title id="hero-funnel-title">
          {showDemoFigures
            ? "An illustrative pipeline funnel: LinkedIn, email, website, paid ads, and referrals feed into leads, which narrow to qualified prospects, then booked meetings, then closed deals and revenue growth. The figures shown are mockup placeholders, not real results."
            : "A pipeline funnel: LinkedIn, email, website, paid ads, and referrals feed into leads, which narrow to qualified prospects, then booked meetings, then closed deals and revenue growth."}
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
              d={`M ${chip.x + 27} ${chip.y + 56} Q ${chip.x + 27} ${chip.y + 86}, ${chip.to.x} ${chip.to.y}`}
              fill="none"
              stroke="#0f4d42"
              strokeWidth="1.8"
              markerEnd="url(#arrowHead)"
            />
            <rect x={chip.x} y={chip.y} width="54" height="54" rx="12" fill="#ffffff" />
            <foreignObject x={chip.x + 17} y={chip.y + 8} width="20" height="20">
              <div className="flex h-5 w-5 items-center justify-center text-primary">
                <chip.Icon className="h-[18px] w-[18px]" />
              </div>
            </foreignObject>
            <text
              x={chip.x + 27}
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
            {showDemoFigures ? (
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
            ) : null}
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
          Revenue Growth
        </text>
        </g>

        {/* Floating metric cards — mockup figures, preview mode only. */}
        {showDemoFigures ? STAT_CARDS.map((card) => (
          <g key={card.label}>
            <rect x={CARD_X} y={card.y} width="208" height="50" rx="10" fill="#ffffff" stroke="#e4ece8" />
            <rect x={CARD_X + 12} y={card.y + 12} width="26" height="26" rx="7" fill="#e3f3ec" />
            <foreignObject x={CARD_X + 17} y={card.y + 17} width="16" height="16">
              <div className="flex h-4 w-4 items-center justify-center text-primary">
                <card.Icon className="h-[14px] w-[14px]" />
              </div>
            </foreignObject>
            <text x={CARD_X + 48} y={card.y + 26} fontSize="16" fontWeight="700" fill="#114f44">
              {card.value}
            </text>
            <text x={CARD_X + 48} y={card.y + 39} fontSize="8.5" fill="#6b7c76">
              {card.label}
            </text>
            <text x={CARD_X + 196} y={card.y + 23} textAnchor="end" fontSize="9.5" fontWeight="700" fill="#1f8f6d">
              {card.delta}
            </text>
            <text x={CARD_X + 196} y={card.y + 35} textAnchor="end" fontSize="7.5" fill="#9aa8a3">
              vs last month
            </text>
          </g>
        )) : null}

        {/* pipeline growth card — mockup figures, preview mode only. */}
        {showDemoFigures ? (
        <g>
          <rect x={CARD_X} y="436" width="208" height="86" rx="10" fill="#ffffff" stroke="#e4ece8" />
          <text x={CARD_X + 12} y="454" fontSize="9" fontWeight="700" fill="#4a5a55">
            Pipeline Growth
          </text>
          {PIPELINE_BARS.map((height, i) => (
            <rect
              key={height}
              x={CARD_X + 14 + i * 17}
              y={510 - height}
              width="11"
              height={height}
              rx="3"
              fill={i >= PIPELINE_BARS.length - 2 ? "#1f8f6d" : "#9ed4bb"}
            />
          ))}
          <path
            d={`M ${CARD_X + 14} 492 L ${CARD_X + 48} 478 L ${CARD_X + 78} 466 L ${CARD_X + 114} 452`}
            fill="none"
            stroke="#1f8f6d"
            strokeWidth="2"
            markerEnd="url(#arrowHeadDown)"
          />
          <rect x={CARD_X + 124} y="462" width="74" height="46" rx="9" fill="#d7f0e3" />
          <text x={CARD_X + 161} y="482" textAnchor="middle" fontSize="14" fontWeight="700" fill="#114f44">
            +72%
          </text>
          <text x={CARD_X + 161} y="492" textAnchor="middle" fontSize="6.5" fill="#4a7a68">
            Pipeline Value
          </text>
          <text x={CARD_X + 161} y="501" textAnchor="middle" fontSize="6.5" fill="#4a7a68">
            in 3 Months
          </text>
        </g>
        ) : null}
      </svg>

      {/* Text equivalent for screen readers and no-JS contexts */}
      <p className="sr-only">
        Pipeline diagram. Five acquisition channels — LinkedIn, email, website, paid ads and
        referrals — feed a funnel that narrows from leads, to qualified prospects, to booked
        meetings, to closed deals, and then to revenue growth.
        {showDemoFigures
          ? " All figures shown are mockup placeholders and do not represent real results."
          : ""}
      </p>
    </figure>
  );
}
