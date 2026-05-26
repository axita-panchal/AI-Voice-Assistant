import ProtectedRoute from "@/components/ProtectedRoute";
import Header from "@/components/common/Header";

export default function ProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ProtectedRoute>
      <div className="flex flex-col h-screen bg-[#F6F8FB]">
        <Header />
        {children}
      </div>
    </ProtectedRoute>
  );
}

