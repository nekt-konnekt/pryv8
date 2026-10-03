import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "PRYV8 | Private conversations. Real connections.",
  description:
    "PRYV8 is validating a private conversation marketplace for verified adults.",
  metadataBase: new URL("https://pryv8.vercel.app"),
  openGraph: {
    title: "PRYV8 | Meet someone. Make it personal.",
    description:
      "Private one-on-one conversations and connections for adults.",
    url: "https://pryv8.vercel.app",
    siteName: "PRYV8",
    type: "website",
    images: [
      {
        url: "https://images.unsplash.com/photo-1770777355087-f18707049b54?auto=format&fit=crop&fm=jpg&ixlib=rb-4.1.0&q=85&w=1200&h=630",
        width: 1200,
        height: 630,
        alt: "African woman in a bold editorial fashion portrait",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "PRYV8 | Meet someone. Make it personal.",
    description:
      "Private one-on-one conversations and connections for adults.",
    images: [
      "https://images.unsplash.com/photo-1770777355087-f18707049b54?auto=format&fit=crop&fm=jpg&ixlib=rb-4.1.0&q=85&w=1200&h=630",
    ],
  },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}