import type { Metadata } from "next";
import { ChannelPageTemplate } from "@/components/ChannelPageTemplate";
import { getChannel } from "@/data/services";

const channel = getChannel("cold-email")!;

export const metadata: Metadata = {
  title: channel.titleTag,
  description: channel.intro,
  alternates: { canonical: "/services/cold-email" },
};

export default function ColdEmailPage() {
  return <ChannelPageTemplate slug="cold-email" />;
}
