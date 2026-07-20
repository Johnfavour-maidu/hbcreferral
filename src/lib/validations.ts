import { z } from "zod";

export const registerSchema = z
  .object({
    fullName: z
      .string()
      .min(2, "Name must be at least 2 characters")
      .max(100, "Name is too long"),
    email: z.string().email("Invalid email address"),
    phone: z
      .string()
      .min(10, "Phone number must be at least 10 digits")
      .max(15, "Phone number is too long")
      .regex(/^\+?[0-9]+$/, "Invalid phone number"),
    state: z.string().min(2, "Please select your state"),
    school: z.string().min(2, "School name is required"),
    instagram: z
      .string()
      .min(1, "Instagram username is required")
      .regex(/^@?[A-Za-z0-9_.]+$/, "Invalid Instagram username"),
    password: z
      .string()
      .min(8, "Password must be at least 8 characters")
      .regex(/[A-Z]/, "Password must contain an uppercase letter")
      .regex(/[0-9]/, "Password must contain a number"),
    confirmPassword: z.string(),
    agreeToRules: z.literal(true, {
      errorMap: () => ({ message: "You must agree to the rules" }),
    }),
    referredBy: z.string().optional(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

export const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(1, "Password is required"),
});

export const profileSchema = z.object({
  fullName: z.string().min(2).max(100),
  phone: z.string().min(10).max(15),
  state: z.string().min(2),
  school: z.string().min(2),
  instagram: z.string().regex(/^@?[A-Za-z0-9_.]+$/),
});

export const campaignSchema = z.object({
  name: z.string().min(1),
  description: z.string().optional(),
  startDate: z.string().optional(),
  endDate: z.string().optional(),
  registrationEnabled: z.boolean(),
  leaderboardVisible: z.boolean(),
  goldReward: z.number().min(0),
  silverReward: z.number().min(0),
  bronzeReward: z.number().min(0),
});

export type RegisterInput = z.infer<typeof registerSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
export type ProfileInput = z.infer<typeof profileSchema>;
export type CampaignInput = z.infer<typeof campaignSchema>;
