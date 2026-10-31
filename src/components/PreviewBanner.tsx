import { siteConfig } from "@/config/site";

export function PreviewBanner() {
  if (siteConfig.siteMode !== "preview") return null;
  return (
    // A landmark, so the banner is reachable by landmark navigation instead of
    // sitting outside every region on the page.
    <aside
      aria-label="Site status"
      className="bg-ink px-4 py-2 text-center text-xs font-medium text-dark-fg"
    >
      Website preview — content and enquiries on this site are illustrative only.
    </aside>
  );
}
