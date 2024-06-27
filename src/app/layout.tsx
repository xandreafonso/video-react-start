import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Video App",
  description: "Player de Vídeo para Páginas de Vendas",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pr-br" className="h-full">
      <body className={`${inter.className} h-full`}>{children}</body>
    </html>
  );
}
