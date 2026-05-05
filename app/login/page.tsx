import LoginClient from "@/components/loginclient";

export default function Page({
  searchParams,
}: {
  searchParams: { expired?: string; redirect?: string };
}) {
  return (
    <LoginClient
      expired={searchParams.expired}
      redirect={searchParams.redirect}
    />
  );
}