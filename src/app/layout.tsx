import type { Metadata } from "next";
import "./globals.css";


export const metadata: Metadata = {
  title: "Ran-gi",
  description: "Ran-gi is a puzzle that's great as a browser game.",
  authors : [{name : "Ndunge Muga", url : "https://github.com/postzed"}],
  keywords:["browser game", "puzzle game", "sudoku", "wordle"]
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
