import type { Metadata } from "next";
import { ChannelPageTemplate } from "@/components/ChannelPageTemplate";
import { getChannel } from "@/data/services";

const channel = getChannel("linkedin-outreach")!;

export const metadata: Metadata = {
  title: channel.titleTag,
  description: channel.intro,
  alternates: { canonical: "/services/linkedin-outreach" },
};

export default function LinkedInOutreachPage() {
  return <ChannelPageTemplate slug="linkedin-outreach" />;
}
