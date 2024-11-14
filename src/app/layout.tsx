import type { Metadata } from "next";
import "./globals.css";
import localFont from "next/font/local";
import "@/styles/style.scss";
import "@/styles/cmn_button.scss";
import "@/styles/color_variable.scss";
import "@/styles/font_variable.scss";
import "@/styles/All_Module.scss"
import "@/styles/responsive.scss";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata: Metadata = {
  title: "Create Next App",
  description: "Generated by create next app",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable}`}>
        {children}
      </body>
    </html>
  );
}
