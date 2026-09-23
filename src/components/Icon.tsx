type IconProps = { className?: string };

const base = "h-5 w-5";

function wrap(children: React.ReactNode, className?: string) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.75}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className={className ?? base}
    >
      {children}
    </svg>
  );
}

export function MailIcon({ className }: IconProps) {
  return wrap(
    <>
      <rect x="3" y="5" width="18" height="14" rx="2" />
      <path d="m3.5 6 8.5 7 8.5-7" />
    </>,
    className
  );
}

export function ShareIcon({ className }: IconProps) {
  return wrap(
    <>
      <circle cx="6" cy="12" r="2.4" />
      <circle cx="17.5" cy="6" r="2.4" />
      <circle cx="17.5" cy="18" r="2.4" />
      <path d="M8.1 10.8 15.5 7M8.1 13.2l7.4 3.8" />
    </>,
    className
  );
}

export function PhoneIcon({ className }: IconProps) {
  return wrap(
    <path d="M6.6 3.5h2.7l1.3 4-2 1.4a11.6 11.6 0 0 0 5.5 5.5l1.4-2 4 1.3v2.7c0 1.1-1 2-2.1 1.9A17 17 0 0 1 4.7 5.6c-.1-1.1.8-2.1 1.9-2.1Z" />,
    className
  );
}

export function StorefrontIcon({ className }: IconProps) {
  return wrap(
    <>
      <path d="M4 9.5 5 4h14l1 5.5" />
      <path d="M4 9.5a2.5 2.5 0 0 0 5 0 2.5 2.5 0 0 0 5 0 2.5 2.5 0 0 0 5 0" />
      <path d="M5.5 10v9.5h13V10" />
      <path d="M10 19.5V14h4v5.5" />
    </>,
    className
  );
}

export function RefreshIcon({ className }: IconProps) {
  return wrap(
    <>
      <path d="M4.5 12a7.5 7.5 0 0 1 12.6-5.5L19.5 8" />
      <path d="M19.5 4v4h-4" />
      <path d="M19.5 12a7.5 7.5 0 0 1-12.6 5.5L4.5 16" />
      <path d="M4.5 20v-4h4" />
    </>,
    className
  );
}

export function TargetIcon({ className }: IconProps) {
  return wrap(
    <>
      <circle cx="12" cy="12" r="8" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="12" cy="12" r="0.6" fill="currentColor" />
    </>,
    className
  );
}

export function UserBadgeIcon({ className }: IconProps) {
  return wrap(
    <>
      <circle cx="9" cy="8.5" r="3" />
      <path d="M3.5 19c.6-3 2.7-4.8 5.5-4.8s4.9 1.8 5.5 4.8" />
      <path d="M16 5.5h4.5v5L18.3 12l-2.3-1.5Z" />
    </>,
    className
  );
}

export function ChatIcon({ className }: IconProps) {
  return wrap(
    <path d="M4 5.5h16v10H9.5L5.5 19v-3.5H4Z" />,
    className
  );
}

export function CheckBadgeIcon({ className }: IconProps) {
  return wrap(
    <>
      <path d="M12 3.5 15 5l3.2-.3 1.1 3 2.2 2.3-1.3 3 1.3 3-2.2 2.3-1.1 3L15 21l-3 1.5L9 21l-3.2.3-1.1-3-2.2-2.3 1.3-3-1.3-3 2.2-2.3 1.1-3L9 5Z" />
      <path d="m8.5 12.5 2.3 2.3 4.7-4.8" />
    </>,
    className
  );
}

export function GearIcon({ className }: IconProps) {
  return wrap(
    <>
      <circle cx="12" cy="12" r="3" />
      <path d="M12 3.5v2M12 18.5v2M4.5 12h2M17.5 12h2M6.3 6.3l1.4 1.4M16.3 16.3l1.4 1.4M6.3 17.7l1.4-1.4M16.3 7.7l1.4-1.4" />
    </>,
    className
  );
}

export function ArrowRightIcon({ className }: IconProps) {
  return wrap(<path d="M4 12h15M13 6l6 6-6 6" />, className);
}

export function GlobeIcon({ className }: IconProps) {
  return wrap(
    <>
      <circle cx="12" cy="12" r="8.5" />
      <path d="M3.5 12h17M12 3.5c2.3 2.3 3.5 5.3 3.5 8.5s-1.2 6.2-3.5 8.5c-2.3-2.3-3.5-5.3-3.5-8.5S9.7 5.8 12 3.5Z" />
    </>,
    className
  );
}

export function LayersIcon({ className }: IconProps) {
  return wrap(
    <>
      <path d="m12 3.5 8.5 4.5-8.5 4.5-8.5-4.5Z" />
      <path d="m3.5 12.5 8.5 4.5 8.5-4.5" />
      <path d="m3.5 16.5 8.5 4.5 8.5-4.5" />
    </>,
    className
  );
}

export function TagIcon({ className }: IconProps) {
  return wrap(
    <>
      <path d="M11.5 3.5H5a1.5 1.5 0 0 0-1.5 1.5v6.5a1.5 1.5 0 0 0 .44 1.06l8 8a1.5 1.5 0 0 0 2.12 0l6.5-6.5a1.5 1.5 0 0 0 0-2.12l-8-8A1.5 1.5 0 0 0 11.5 3.5Z" />
      <circle cx="8.5" cy="8.5" r="1.25" fill="currentColor" stroke="none" />
    </>,
    className
  );
}

export function BriefcaseIcon({ className }: IconProps) {
  return wrap(
    <>
      <rect x="3" y="7.5" width="18" height="12" rx="2" />
      <path d="M8.5 7.5V6a2 2 0 0 1 2-2h3a2 2 0 0 1 2 2v1.5" />
      <path d="M3 12.5h18" />
    </>,
    className
  );
}

export function CodeIcon({ className }: IconProps) {
  return wrap(<path d="m9 8-4.5 4L9 16M15 8l4.5 4-4.5 4M13.5 5.5l-3 13" />, className);
}

export function CheckIcon({ className }: IconProps) {
  return wrap(<path d="M4.5 12.5 9 17l10.5-11" />, className);
}

export function UsersIcon({ className }: IconProps) {
  return wrap(
    <>
      <circle cx="9" cy="8" r="3.2" />
      <path d="M3 19c.6-3.2 2.9-5 6-5s5.4 1.8 6 5" />
      <path d="M16.5 5.6a3.2 3.2 0 0 1 0 5.8M17.5 14.4c2 .7 3.3 2.3 3.7 4.6" />
    </>,
    className
  );
}

export function SearchIcon({ className }: IconProps) {
  return wrap(
    <>
      <circle cx="11" cy="11" r="6.5" />
      <path d="m16 16 4.5 4.5" />
    </>,
    className
  );
}

export function CalendarIcon({ className }: IconProps) {
  return wrap(
    <>
      <rect x="3.5" y="5" width="17" height="15" rx="2" />
      <path d="M3.5 9.5h17M8 3.5v3M16 3.5v3" />
    </>,
    className
  );
}

export function HandshakeIcon({ className }: IconProps) {
  return wrap(
    <>
      <path d="m3 12 3.5-3.5 4 1 3-1 3.5 2.5" />
      <path d="M13.5 10.5l3.5 3.5-2 2-2.5-2.5" />
      <path d="M6.5 8.5 3 12l3 3 2-1.5" />
      <path d="M10.5 9.5 8 12l3 3 2-1.5" />
    </>,
    className
  );
}

export function DollarIcon({ className }: IconProps) {
  return wrap(
    <>
      <path d="M12 3.5v17" />
      <path d="M16 7.5c-.8-1.3-2.3-2-4-2-2.2 0-3.8 1.1-3.8 2.9 0 4 7.8 2.2 7.8 6.3 0 1.9-1.8 3.1-4 3.1-1.9 0-3.5-.8-4.2-2.2" />
    </>,
    className
  );
}

export function TrendUpIcon({ className }: IconProps) {
  return wrap(
    <>
      <path d="m3.5 16.5 5-5 3.5 3.5 7-7.5" />
      <path d="M14.5 7.5h5.5V13" />
    </>,
    className
  );
}

const CHANNEL_ICONS: Record<string, (props: IconProps) => React.ReactElement> = {
  "cold-email": MailIcon,
  "linkedin-outreach": ShareIcon,
  "cold-calling": PhoneIcon,
  "marketplace-prospecting": StorefrontIcon,
};

export function ChannelIcon({ slug, className }: { slug: string } & IconProps) {
  const IconComponent = CHANNEL_ICONS[slug] ?? MailIcon;
  return <IconComponent className={className} />;
}

