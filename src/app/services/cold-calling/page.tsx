import type { Metadata } from "next";
import { ChannelPageTemplate } from "@/components/ChannelPageTemplate";
import { getChannel } from "@/data/services";

const channel = getChannel("cold-calling")!;

export const metadata: Metadata = {
  title: channel.titleTag,
  description: channel.intro,
  alternates: { canonical: "/services/cold-calling" },
};

export default function ColdCallingPage() {
  return <ChannelPageTemplate slug="cold-calling" />;
}
