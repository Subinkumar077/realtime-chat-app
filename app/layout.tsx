import type { Metadata } from "next";
import "./globals.css";
import { Providers } from "./providers";

export const metadata: Metadata = {
  title: "Whisper",
  description: "A modern real-time chat application",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased" style={{ fontFamily: '"Helvetica Neue", Helvetica, Arial, sans-serif' }}>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
