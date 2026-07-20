export const siteConfig = {
  name: "Hearts by Charming",
  description: "Premium referral management platform for Hearts by Charming youth development NGO",
  url: process.env.NEXT_PUBLIC_APP_URL || "https://heartsbycharming.org",
  ogImage: "/og-image.png",
  links: {
    twitter: "https://twitter.com/heartsbycharming",
    instagram: "https://instagram.com/heartsbycharming",
    facebook: "https://facebook.com/heartsbycharming",
  },
};

export const colors = {
  gold: {
    DEFAULT: "#C89A2B",
    light: "#E5C66A",
    dark: "#A07A1F",
  },
  brown: {
    DEFAULT: "#4A2E1F",
    light: "#7B5B43",
    dark: "#2D2118",
  },
  cream: {
    DEFAULT: "#FFF8EF",
    dark: "#F7F3EC",
  },
  white: "#FFFFFF",
  success: "#3BA55C",
  warning: "#F59E0B",
  error: "#DC2626",
};

export const REWARD_TIERS = {
  GOLD: { name: "Gold", value: 10000, referrals: 30, color: "#C89A2B" },
  SILVER: { name: "Silver", value: 7000, referrals: 20, color: "#C0C0C0" },
  BRONZE: { name: "Bronze", value: 5000, referrals: 10, color: "#CD7F32" },
} as const;

export const NIGERIAN_STATES = [
  "Abia", "Adamawa", "Akwa Ibom", "Anambra", "Bauchi", "Bayelsa",
  "Benue", "Borno", "Cross River", "Delta", "Ebonyi", "Edo",
  "Ekiti", "Enugu", "FCT", "Gombe", "Imo", "Jigawa", "Kaduna",
  "Kano", "Katsina", "Kebbi", "Kogi", "Kwara", "Lagos", "Nasarawa",
  "Niger", "Ogun", "Ondo", "Osun", "Oyo", "Plateau", "Rivers",
  "Sokota", "Taraba", "Yobe", "Zamfara",
];
