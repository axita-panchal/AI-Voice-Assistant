import Header from "@/components/common/Header";

export default function AgentsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col h-screen">
      <Header />
      <main className="flex-1 overflow-auto lg:overflow-hidden bg-[#F6F8FB]">
        {children}
      </main>
    </div>
  );
}
