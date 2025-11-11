import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = { title: "CulShare", description: "A social platform for sharing cultural and artistic interests." };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      {/* --- تغییر کلیدی اینجاست --- */}
      {/* ما یک گرادیانت زیبا به عنوان پس‌زمینه کل اپلیکیشن اعمال میکنیم */}
      <body className={`${inter.className} bg-gradient-to-br from-gray-900 to-slate-800 text-slate-100`}>
        <Header />
        <main>{children}</main>
      </body>
    </html>
  );
}