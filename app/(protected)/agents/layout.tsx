export default function AgentsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <main className="flex-1 overflow-auto lg:overflow-hidden">
      {children}
    </main>
  );
}

