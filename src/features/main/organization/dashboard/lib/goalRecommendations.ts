export const GOAL_TYPES_LIST = {
  MEMBER_GROWTH: "member_growth",
  EVENT_PARTICIPATION: "event_participation",
  ENGAGEMENT: "engagement",
  ANNOUNCEMENT_ACTIVITY: "announcement_activity",
  RETENTION: "retention",
} as const;

export const GOAL_TYPE_LABELS = {
  member_growth: "Member Growth Goal",
  event_participation: "Event Participation Goal",
  engagement: "Engagement Goal",
  announcement_activity: "Announcement Activity Goal",
  retention: "Retention Goal",
} as const;

export interface RecommendationMessage {
  title: string;
  message: string;
}

export const GOAL_RECOMMENDATIONS: Record<
  string,
  {
    positive: RecommendationMessage;
    negative: RecommendationMessage;
  }
> = {
  member_growth: {
    positive: {
      title: "Great work! 🎉",
      message:
        "Your community is growing strong. Keep up the momentum by continuing your outreach efforts and welcoming new members with engaging onboarding content to retain them long-term.",
    },
    negative: {
      title: "Growth Below Target",
      message:
        "Growth is below target. Consider revisiting your recruitment strategies, such as promoting your community on more platforms, running referral campaigns, or collaborating with other groups to attract new members.",
    },
  },
  event_participation: {
    positive: {
      title: "Excellent Turnout! 🚀",
      message:
        "Your events are attracting strong interest. Consider expanding event variety or frequency to maintain this engagement level and keep participants coming back.",
    },
    negative: {
      title: "Participation Below Target",
      message:
        "Participation fell short this month. Try improving event visibility through timely announcements, adjusting event schedules to better fit your members' availability, or introducing more appealing event topics.",
    },
  },
  engagement: {
    positive: {
      title: "Highly Engaged! 💪",
      message:
        "Your community is actively engaging! This shows members find your content valuable. Keep posting relevant and interactive content to sustain and grow this interaction rate.",
    },
    negative: {
      title: "Engagement Below Expected",
      message:
        "Engagement is lower than expected. Encourage more interaction by posting events, questions, and discussion topics that prompt responses. Recognizing active members can also motivate others to participate.",
    },
  },
  announcement_activity: {
    positive: {
      title: "Consistent Communication! ✅",
      message:
        "Well done on staying consistent with your announcements! Regular communication keeps your community informed and engaged. Maintain this habit to build trust and reliability.",
    },
    negative: {
      title: "Announcement Frequency Low",
      message:
        "Announcement frequency was below the set goal. Establish a consistent posting schedule and plan content in advance to ensure your community stays informed and connected throughout the month.",
    },
  },
  retention: {
    positive: {
      title: "Outstanding Retention! ⭐",
      message:
        "Outstanding retention! Your members are satisfied and committed to your community. Continue fostering a welcoming and valuable environment to keep this rate low.",
    },
    negative: {
      title: "Higher Attrition Rate",
      message:
        "More members are leaving than targeted. Take time to understand why by gathering feedback or monitoring community activity. Focus on improving member experience, addressing concerns, and increasing value within the community.",
    },
  },
};