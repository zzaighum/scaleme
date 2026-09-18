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

// Abstract connection mark: three coordinated points, echoing the four
// channels feeding into one handoff. Deliberately simple per the brief
// ("a simple typographic wordmark and an abstract connection mark are
// enough for the preview") rather than a full illustrative logo.
export function BrandMark({ className = "h-8 w-8" }: IconProps) {
  return (
    <svg viewBox="0 0 32 32" fill="none" aria-hidden="true" className={className}>
      <circle cx="16" cy="16" r="15" fill="var(--color-primary)" opacity="0.1" />
      <path
        d="M9 20.5 15 9M15 9l8 3.5M9 20.5 23 12.5"
        stroke="var(--color-primary)"
        strokeWidth="1.6"
        strokeLinecap="round"
      />
      <circle cx="15" cy="9" r="2.4" fill="var(--color-primary)" />
      <circle cx="23" cy="12.5" r="2.4" fill="var(--color-accent)" />
      <circle cx="9" cy="20.5" r="2.4" fill="var(--color-primary)" />
    </svg>
  );
}
