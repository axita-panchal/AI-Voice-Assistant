import Header from "@/components/common/Header";

export default function SettingsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col h-screen">
      <Header />
      <main className="flex-1 overflow-auto bg-[#F6F8FB]">{children}</main>
    </div>
  );
}
