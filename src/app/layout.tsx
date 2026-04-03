import type { Metadata } from "next";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { ThemeToggle } from "@/components/theme-toggle";
import { BrandSwitcherNav } from "@/components/brand-switcher-nav";
import { NavLinks } from "@/components/nav-links";

export const metadata: Metadata = {
  title: "TheMarketer",
  description:
    "AI marketing platform. Paste a URL, get ad recommendations, track performance.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="min-h-screen bg-[var(--background)] text-foreground antialiased">
        <ThemeProvider>
          <nav className="border-b border-border bg-[var(--background)] sticky top-0 z-50">
            <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-10">
              <div className="flex items-center justify-between h-14">
                <a href="/dashboard" className="text-[15px] font-semibold tracking-tight text-foreground">
                  TheMarketer
                </a>
                <div className="flex items-center gap-4">
                  <BrandSwitcherNav />
                  <div className="h-4 w-px bg-border" />
                  <NavLinks />
                  <div className="h-4 w-px bg-border" />
                  <ThemeToggle />
                </div>
              </div>
            </div>
          </nav>
          <main className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-10 py-10">
            {children}
          </main>
        </ThemeProvider>
      </body>
    </html>
  );
}
