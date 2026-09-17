import { siteConfig } from "@/config/site";

export function PreviewBanner() {
  if (siteConfig.siteMode !== "preview") return null;
  return (
    <div className="bg-ink px-4 py-2 text-center text-xs font-medium text-dark-fg">
      Website preview — content and enquiries on this site are illustrative only.
    </div>
  );
}
