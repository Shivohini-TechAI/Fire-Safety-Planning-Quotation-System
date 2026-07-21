import type { Metadata } from "next";
import "./globals.css";
import { AuthProvider } from "@/context/AuthContext";
import Toast from "@/components/ui/Toast";
import QueryProvider from "@/components/providers/QueryProvider";

export const metadata: Metadata = {
  title: "FireSafe BOQ Estimator",
  description: "Fire safety BOQ cost estimation platform — Shivohini Tech LLP",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="antialiased bg-[#060b18] text-[#eef0f4]">
        <QueryProvider>
          <AuthProvider>
            {children}
            <Toast />
          </AuthProvider>
        </QueryProvider>
      </body>
    </html>
  );
}
