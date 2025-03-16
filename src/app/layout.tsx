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
    <html lang="en" className="dark">
      <body className={inter.className}>
        <div className="min-h-screen flex flex-col bg-background relative">
          {/* Rich background elements */}
          <div className="fixed inset-0 -z-10 grid-pattern opacity-20 pointer-events-none"></div>

          {/* Gradient orbs */}
          <div className="fixed top-[-10%] left-[-10%] w-[30%] h-[40%] bg-gradient-radial from-primary/20 to-transparent rounded-full blur-3xl opacity-20 animate-pulse-slow pointer-events-none"></div>
          <div className="fixed bottom-[-10%] right-[-5%] w-[25%] h-[35%] bg-gradient-radial from-secondary/20 to-transparent rounded-full blur-3xl opacity-20 animate-pulse-slow pointer-events-none"></div>
          <div className="fixed top-[40%] right-[5%] w-[15%] h-[20%] bg-gradient-radial from-accent/20 to-transparent rounded-full blur-3xl opacity-10 animate-pulse-slow pointer-events-none"></div>

          {/* Header */}
          <header className="sticky top-0 z-50 border-b border-white/[0.08] bg-background/80 backdrop-blur-md">
            <div className="container mx-auto px-4">
              <div className="h-16 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 bg-gradient-to-br from-primary to-primary/80 rounded-md flex items-center justify-center shadow-md">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5 text-white"><circle cx="12" cy="12" r="10" /><path d="m8 16 4-4 4 4" /><path d="m8 8 4 4 4-4" /></svg>
                  </div>
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
          <footer className="border-t border-white/[0.08] py-8 backdrop-blur-sm bg-background/30 relative z-10">
            <div className="container mx-auto px-4">
              <div className="flex flex-col md:flex-row justify-between items-center gap-6">
                <div className="flex items-center gap-3">
                  <div className="h-8 w-8 bg-gradient-to-br from-primary to-primary/80 rounded-md flex items-center justify-center">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4 text-white"><circle cx="12" cy="12" r="10" /><path d="m8 16 4-4 4 4" /><path d="m8 8 4 4 4-4" /></svg>
                  </div>
                  <div>
                    <p className="text-sm font-medium">Haxball Tournament</p>
                    <p className="text-xs text-muted-foreground">Modern tournament management</p>
                  </div>
                </div>

                <div className="flex flex-col items-center">
                  <p className="text-sm text-muted-foreground">
                    &copy; {new Date().getFullYear()} | All Rights Reserved
                  </p>
                  <div className="flex gap-2 mt-1">
                    <span className="w-1 h-1 rounded-full bg-primary"></span>
                    <span className="w-1 h-1 rounded-full bg-secondary"></span>
                    <span className="w-1 h-1 rounded-full bg-accent"></span>
                  </div>
                </div>

                <div className="flex gap-3">
                  <div className="h-9 w-9 flex items-center justify-center rounded-full glass hover-fade hover:border-white/20 cursor-pointer transition-all">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path></svg>
                  </div>
                  <div className="h-9 w-9 flex items-center justify-center rounded-full glass hover-fade hover:border-white/20 cursor-pointer transition-all">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"></path></svg>
                  </div>
                  <div className="h-9 w-9 flex items-center justify-center rounded-full glass hover-fade hover:border-white/20 cursor-pointer transition-all">
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
