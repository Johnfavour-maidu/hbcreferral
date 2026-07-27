export interface UserProfile {
  id: string;
  userId: string;
  participantId: string;
  fullName: string;
  instagram: string;
  state: string;
  referralCode: string;
  referralLink: string;
  qrCodeUrl: string | null;
  totalReferrals: number;
  verifiedReferrals: number;
  pendingReferrals: number;
}
