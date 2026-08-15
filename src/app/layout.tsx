import type { Metadata } from "next";
import "./globals.css";
import { BottomNav } from "@/components/BottomNav";

export const metadata: Metadata = {
  title: "Prolingo",
  description: "领域英语学习 — 按场景积累专业词汇",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="zh">
      <body className="bg-neutral-100 text-neutral-900">
        <div className="mx-auto min-h-screen max-w-md bg-white pb-24">{children}</div>
        <BottomNav />
      </body>
    </html>
  );
}
