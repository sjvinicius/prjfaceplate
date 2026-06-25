import LoginClient from "@/components/loginclient";

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{
    expired?: string;
    redirect?: string;
  }>;
}) {
  const params = await searchParams;

  return (
    <LoginClient
      expired={params.expired}
      redirect={params.redirect}
    />
  );
}