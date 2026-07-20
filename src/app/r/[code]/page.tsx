import { redirect } from "next/navigation";
import { NextRequest } from "next/server";

export default async function ReferralPage({
  params,
}: {
  params: Promise<{ code: string }>;
}) {
  const { code } = await params;

  redirect(`/register?ref=${code}`);
}
