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
      title: "Great job! 🎉",
      message:
        "Keep the momentum going by maintaining your outreach efforts and welcoming new members effectively.",
    },
    negative: {
      title: "Growth Below Target",
      message:
        "Growth is below target. Try promoting your community on more platforms or running referral campaigns to attract new members.",
    },
  },
  event_participation: {
    positive: {
      title: "Excellent turnout! 🚀",
      message:
        "Consider expanding event variety or frequency to keep participants engaged and coming back.",
    },
    negative: {
      title: "Participation Below Target",
      message:
        "Participation fell short. Improve event visibility and adjust schedules to better fit your members' availability.",
    },
  },
  engagement: {
    positive: {
      title: "Your community is actively engaging! 💪",
      message:
        "Keep posting relevant and interactive content to sustain this growth.",
    },
    negative: {
      title: "Engagement Below Expected",
      message:
        "Engagement is low. Post events or discussion topics to encourage more interactions from your members.",
    },
  },
  announcement_activity: {
    positive: {
      title: "Well done on staying consistent! ✅",
      message:
        "Keep up the regular communication to maintain trust and community awareness.",
    },
    negative: {
      title: "Posting Frequency Low",
      message:
        "Posting frequency was low. Plan your content in advance and set a consistent schedule to stay on track.",
    },
  },
  retention: {
    positive: {
      title: "Outstanding retention! ⭐",
      message:
        "Continue fostering a welcoming environment to keep your members satisfied and committed.",
    },
    negative: {
      title: "Too Many Members Leaving",
      message:
        "Too many members are leaving. Gather feedback, address concerns, and focus on improving the overall member experience.",
    },
  },
};