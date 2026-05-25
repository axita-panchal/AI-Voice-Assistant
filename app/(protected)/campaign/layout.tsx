import Header from "@/components/common/Header";

export default function CampaignLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="h-screen flex flex-col">
      <Header />
      <main className="flex-1 overflow-auto lg:overflow-hidden bg-[#F6F8FB]">{children}</main>
    </div>
  );
}
