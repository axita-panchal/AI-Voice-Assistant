import Header from "@/components/common/Header";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="bg-[#F6F8FB] flex-1 px-16 py-6 overflow-auto">{children}</main>
    </div>
  );
}
