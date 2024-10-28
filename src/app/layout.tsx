import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";

import Layout from "./components/Layout";
import Coin98AdapterProvider from "./providers/Coin98WalletProvider";
import Coin98AdapterModal from "./providers/Coin98AdapterModal";
import AppProvider from "./providers/AppProvider";

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
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <Coin98AdapterProvider>
          <AppProvider>
            <ThemeProvider
              attribute="class"
              defaultTheme="dark"
              enableSystem
              disableTransitionOnChange
            >
              <Layout>{children}</Layout>
            </ThemeProvider>
          </AppProvider>
          <Coin98AdapterModal />
        </Coin98AdapterProvider>
      </body>
    </html>
  );
}