import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Kasimedu Direct | Overnight Catch • Morning Porter Delivery",
  description:
    "Direct harbor fresh seafood pre-orders. Cutoff at 11:00 PM, 4:00 AM auction procurement, and morning 7:00 AM doorstep delivery via Porter.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Mukta+Malar:wght@400;600;700;800&family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="font-sans min-h-screen bg-slate-50 flex flex-col">{children}</body>
    </html>
  );
}
