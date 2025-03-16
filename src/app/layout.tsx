import "./globals.css";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { MainNav } from "@/components/ui/nav";

const inter = Inter({ subsets: ["latin"], weight: ["400", "500", "600", "700"] });

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
        <div className="min-h-screen flex flex-col">
          {/* Minimal geometric background patterns */}
          <div className="fixed inset-0 -z-10 dot-pattern opacity-5 pointer-events-none"></div>

          {/* Accent corners */}
          <div className="fixed top-0 left-0 w-32 h-32 bg-primary opacity-20 rounded-br-full -z-10"></div>
          <div className="fixed bottom-0 right-0 w-32 h-32 bg-secondary opacity-20 rounded-tl-full -z-10"></div>

          {/* Header */}
          <header className="sticky top-0 z-50 border-b border-border/50 bg-background/90 backdrop-blur-sm">
            <div className="container mx-auto px-4">
              <div className="h-16 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="h-8 w-8 bg-primary rounded-sm"></div>
                  <h1 className="text-xl font-bold tracking-tight">
                    Haxball<span className="text-primary">Tournament</span>
                  </h1>
                </div>
                <MainNav />
              </div>
            </div>
          </header>

          {/* Main content */}
          <main className="flex-1 container mx-auto px-4 py-8">
            {children}
          </main>

          {/* Footer */}
          <footer className="border-t border-border/50 py-6 bg-background">
            <div className="container mx-auto px-4">
              <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                <div className="flex items-center gap-2">
                  <div className="h-6 w-6 bg-primary rounded-sm"></div>
                  <p className="text-sm font-medium">Haxball Tournament</p>
                </div>

                <p className="text-sm text-muted-foreground">
                  &copy; {new Date().getFullYear()} | Modern Tournament Management
                </p>

                <div className="flex gap-4">
                  <div className="h-8 w-8 flex items-center justify-center rounded bg-muted hover:bg-muted/80 cursor-pointer">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path></svg>
                  </div>
                  <div className="h-8 w-8 flex items-center justify-center rounded bg-muted hover:bg-muted/80 cursor-pointer">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"></path></svg>
                  </div>
                  <div className="h-8 w-8 flex items-center justify-center rounded bg-muted hover:bg-muted/80 cursor-pointer">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line></svg>
                  </div>
                </div>
              </div>
            </div>
          </footer>
        </div>
      </body>
    </html>
  );
}
