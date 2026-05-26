export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <main className="flex-1 px-16 py-6 overflow-auto">{children}</main>
  );
}

