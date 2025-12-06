import "../styles/global.css";
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { SWRProvider } from "@/provider/swrProvider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Taskly",
  description: "Taskly app",
  icons: {
    icon: "/fav.ico",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-gray-hard min-h-screen flex flex-col`}
      >
        <SWRProvider>
          <div className="max-w-screen-2xl mx-auto flex-1 w-full bg-gray-bg">
            {children}
          </div>
        </SWRProvider>
      </body>
    </html>
  );
}
