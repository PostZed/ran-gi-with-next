import type { Metadata } from "next";
import "./globals.css";


export const metadata: Metadata = {
  title: "Ran-gi",
  description: "Ran-gi is a fun puzzle for the whole family.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        {children}
      </body>
    </html>
  );
}
