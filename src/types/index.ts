export interface UserProfile {
  id: string;
  userId: string;
  fullName: string;
  instagram: string;
  state: string;
  school: string;
  referralCode: string;
  referralLink: string;
  qrCodeUrl: string | null;
  totalReferrals: number;
  verifiedReferrals: number;
  pendingReferrals: number;
}

export interface DashboardStats {
  totalReferrals: number;
  verifiedReferrals: number;
  pendingReferrals: number;
  leaderboardPosition: number;
  totalParticipants: number;
}

export interface ReferralData {
  id: string;
  referredEmail: string;
  referredPhone: string;
  referredInstagram: string;
  status: "PENDING" | "VERIFIED" | "REJECTED";
  createdAt: string;
  verifiedAt: string | null;
  rejectionReason: string | null;
}

export interface LeaderboardEntry {
  rank: number;
  userId: string;
  fullName: string;
  totalReferrals: number;
  verifiedReferrals: number;
  avatar?: string;
}

export interface NotificationData {
  id: string;
  title: string;
  message: string;
  type: string;
  isRead: boolean;
  link: string | null;
  createdAt: string;
}

export interface AdminStats {
  totalParticipants: number;
  verifiedParticipants: number;
  pendingVerifications: number;
  todayRegistrations: number;
  totalReferrals: number;
  topReferrer: string;
  dailyGrowth: { date: string; count: number }[];
  verificationRate: number;
}

export interface CampaignSettings {
  id: string;
  name: string;
  status: string;
  startDate: string | null;
  endDate: string | null;
  registrationEnabled: boolean;
  leaderboardVisible: boolean;
  goldReward: number;
  silverReward: number;
  bronzeReward: number;
}
