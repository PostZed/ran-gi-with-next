import type { Metadata } from "next";
import "./globals.css";
import MiniLayout from "./mini-layout"

export const metadata: Metadata = {
  title: "Ran-gi",
  description: "Ran-gi is a browser game.",
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
        <MiniLayout>
          {children}
        </MiniLayout>
      </body>
    </html>
  );
}
