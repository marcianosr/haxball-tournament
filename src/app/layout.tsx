import "./globals.css";
import type { Metadata } from "next";
import { Inter } from "next/font/google";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Haxball Tournament",
  description: "Tournament management for Haxball",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <div className="flex min-h-screen flex-col">
          <header className="bg-primary py-4">
            <div className="container mx-auto px-4 text-white">
              <h1 className="text-2xl font-bold">Haxball Tournament</h1>
            </div>
          </header>
          <main className="flex-1 container mx-auto px-4 py-8">
            {children}
          </main>
          <footer className="bg-muted py-4">
            <div className="container mx-auto px-4 text-sm text-muted-foreground">
              <p>&copy; {new Date().getFullYear()} Haxball Tournament</p>
            </div>
          </footer>
        </div>
      </body>
    </html>
  );
}
