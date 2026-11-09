import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Memoir by FACEZ | Elegant Wedding Live Gallery",
  description: "Interactive wedding photo album, swipeable carousels, stories, highlights and guestbook.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" data-theme="ivory">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,600;0,700;1,400;1,600&family=Plus+Jakarta+Sans:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        />
        <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover" />
      </head>
      <body className="min-h-dvh antialiased flex flex-col bg-canvas text-ink">
        {children}
      </body>
    </html>
  );
}

