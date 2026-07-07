import type { Metadata } from "next";
import { Inter, Geist, Geist_Mono } from "next/font/google";
import ReactQueryProvider from "@/providers/ReactQueryProvider";
import ReduxProvider from "@/store/provider";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Volic - AI Voice Assistant",
  icons: {
    icon: "/favicon.png",
  },
  description:
    "Volic is an AI voice assistant that helps you manage your contacts and contact lists with ease. With Volic, you can create, edit, and delete contact lists, as well as add, edit, and delete contacts within those lists. Volic uses advanced natural language processing to understand your commands and provide accurate responses. Whether you need to quickly find a contact or manage your contact lists on the go, Volic has got you covered.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${inter.variable} ${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <ReduxProvider>
          {" "}
          <ReactQueryProvider>{children}</ReactQueryProvider>
        </ReduxProvider>
      </body>
    </html>
  );
}
