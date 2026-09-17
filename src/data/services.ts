export type ServiceChannel = {
  slug: string;
  navLabel: string;
  cardTitle: string;
  cardBody: string;
  h1: string;
  intro: string;
  includedWork: string[];
  deliverables: string[];
  boundary: string;
  titleTag: string;
};

export const channels: ServiceChannel[] = [
  {
    slug: "cold-email",
    navLabel: "Cold Email",
    cardTitle: "Cold email",
    cardBody:
      "Start relevant conversations with carefully researched accounts.",
    h1: "Start relevant conversations through cold email.",
    intro:
      "Put a specific IT offer in front of researched accounts with messages that explain why a conversation may be useful.",
    includedWork: [
      "Agree the account profile and exclusions.",
      "Research and check available contact details.",
      "Prepare segment-specific messages and follow-ups for approval.",
      "Configure the agreed sending environment.",
      "Classify replies and coordinate qualified next steps.",
    ],
    deliverables: [
      "Targeting brief",
      "Approved messaging",
      "Campaign setup record",
      "Response categories",
      "A performance review",
    ],
    boundary:
      "Delivery depends on recipient systems, sender reputation, and campaign practices. We monitor available signals and adjust activity; inbox placement and response volumes cannot be guaranteed.",
    titleTag: "Cold Email for IT Companies",
  },
  {
    slug: "linkedin-outreach",
    navLabel: "LinkedIn Outreach",
    cardTitle: "LinkedIn outreach",
    cardBody:
      "Engage the people involved in technology and business decisions.",
    h1: "Build professional conversations with relevant IT buyers.",
    intro:
      "Reach people involved in technology and business decisions with clear positioning and a considered reason to connect.",
    includedWork: [
      "Research target accounts and roles.",
      "Review the profile and offer being represented.",
      "Prepare personalised engagement and follow-up.",
      "Handle relevant responses and coordinate a sales handoff using the agreed operating method.",
    ],
    deliverables: [
      "Audience criteria",
      "Profile recommendations",
      "Approved messaging",
      "Conversation records",
      "Qualified next steps",
    ],
    boundary:
      "We agree account access and the operating method before work begins. Activity depends on the account, audience, and platform requirements.",
    titleTag: "LinkedIn Outreach for IT Companies",
  },
  {
    slug: "cold-calling",
    navLabel: "Cold Calling",
    cardTitle: "Cold calling",
    cardBody:
      "Qualify interest through direct conversations and agreed follow-up.",
    h1: "Turn direct conversations into useful sales opportunities.",
    intro:
      "Give prospects a clear reason to speak with your business and give your sales team the context to follow up.",
    includedWork: [
      "Prepare account context and an approved calling script.",
      "Agree contact windows, languages, and coverage.",
      "Handle objections, record call outcomes, qualify relevant interest, and coordinate meetings.",
    ],
    deliverables: [
      "Calling playbook",
      "Disposition records",
      "Qualification notes",
      "Meeting details",
      "Review actions",
    ],
    boundary:
      "We agree the markets, languages, contact windows, and calling practices that the programme can support.",
    titleTag: "Cold Calling for IT Companies",
  },
  {
    slug: "marketplace-prospecting",
    navLabel: "Marketplace Prospecting",
    cardTitle: "Marketplace prospecting",
    cardBody:
      "Find suitable project opportunities and support a considered proposal process.",
    h1: "Find project opportunities that fit your IT expertise.",
    intro:
      "Focus your marketplace effort on briefs where your capabilities, portfolio, and delivery model are relevant.",
    includedWork: [
      "Review profile positioning and portfolio.",
      "Screen opportunities against agreed criteria.",
      "Support tailored proposals, approved follow-up, and interview coordination.",
    ],
    deliverables: [
      "Opportunity shortlist",
      "Bid/no-bid reasons",
      "Proposal drafts or approved submissions",
      "Response records",
      "Interview outcomes",
    ],
    boundary:
      "The proposal identifies the platforms, account owner, permitted access, submission responsibilities, and platform costs. A submitted proposal is not a qualified lead, and project awards are not guaranteed. Keep marketplace communication and contracting within the relevant platform's rules.",
    titleTag: "Marketplace Prospecting for IT Companies",
  },
];

export function getChannel(slug: string): ServiceChannel | undefined {
  return channels.find((c) => c.slug === slug);
}

export function relatedChannels(slug: string): ServiceChannel[] {
  return channels.filter((c) => c.slug !== slug);
}
