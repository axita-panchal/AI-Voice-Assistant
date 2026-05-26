export default function CampaignLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <main className="flex-1 overflow-auto lg:overflow-hidden">{children}</main>
  );
}

