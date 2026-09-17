import type { Metadata } from "next";
import { ChannelPageTemplate } from "@/components/ChannelPageTemplate";
import { getChannel } from "@/data/services";

const channel = getChannel("marketplace-prospecting")!;

export const metadata: Metadata = {
  title: channel.titleTag,
  description: channel.intro,
  alternates: { canonical: "/services/marketplace-prospecting" },
};

export default function MarketplaceProspectingPage() {
  return <ChannelPageTemplate slug="marketplace-prospecting" />;
}
