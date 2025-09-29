import "@/styles/globals.css";
import { QueryProvider } from "@/lib/query-client";
import { Toaster } from "react-hot-toast";

import { type Metadata } from "next";

export const metadata: Metadata = {
  title: "Intania Shop",
  description: "Intania Shop by ESC",
  icons: [{ rel: "icon", url: "/favicon.ico" }],
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className="noto-sans-thai">
      <body>
        <QueryProvider>
          {children}
          <Toaster position="top-right" />
        </QueryProvider>
      </body>
    </html>
  );
}
