import type { Metadata } from "next";
import "./globals.css"; // این فایل CSS تست ما را وارد میکند
import Header from "@/components/Header";

// ما فونت Inter را موقتا غیرفعال میکنیم تا یک متغیر کمتر داشته باشیم
// const inter = Inter({ subsets: ["latin"] }); 

export const metadata: Metadata = { title: "CulShare", description: "A social platform for sharing cultural and artistic interests." };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      {/* تگ body دیگر هیچ کلاسی ندارد و فقط به globals.css تکیه میکند */}
      <body>
        <Header />
        <main>{children}</main>
      </body>
    </html>
  );
}