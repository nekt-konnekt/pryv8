import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "PRYV8 | Private conversations. Real connections.",
  description:
    "PRYV8 is validating a private conversation marketplace for verified adults.",
  metadataBase: new URL("https://pryv8.vercel.app"),
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}