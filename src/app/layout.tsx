import type { Metadata } from "next";
import { Inter, Noto_Sans_KR } from "next/font/google";
import { Providers } from "@/components/providers";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const notoSansKr = Noto_Sans_KR({
  variable: "--font-noto-sans-kr",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "BlockPick Partner",
  description: "블록픽 파트너 캠페인 운영과 분석 대시보드",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko" suppressHydrationWarning>
      <body
        className={`${inter.variable} ${notoSansKr.variable} font-sans antialiased`}
        style={{
          fontFamily:
            "var(--font-inter), var(--font-noto-sans-kr), -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
        }}
        suppressHydrationWarning
      >
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
