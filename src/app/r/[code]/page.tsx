import { redirect } from "next/navigation";

const INSTAGRAM_URL = "https://www.instagram.com/heartsbycharming_?igsh=MWRtbjlzeGZtNGI5MA%3D%3D&utm_source=qr";

export default async function ReferralPage({
  params,
}: {
  params: Promise<{ code: string }>;
}) {
  redirect(INSTAGRAM_URL);
}
