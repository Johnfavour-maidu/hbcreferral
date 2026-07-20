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
  purple: {
    DEFAULT: "#5B2D90",
    light: "#7B4DB0",
    dark: "#3D1A60",
  },
  gold: {
    DEFAULT: "#C89A2B",
    light: "#D4AD4F",
    dark: "#A07A1F",
  },
  chocolate: {
    DEFAULT: "#4A2E1F",
    light: "#6B4A3A",
    dark: "#2E1A0F",
  },
  cream: {
    DEFAULT: "#FFF8EF",
    dark: "#F5E6D0",
  },
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
