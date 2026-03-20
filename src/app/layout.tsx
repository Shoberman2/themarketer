import type { Metadata } from "next";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { ThemeToggle } from "@/components/theme-toggle";

export const metadata: Metadata = {
  title: "TheMarketer | Premium AI Marketing Agency",
  description:
    "Your AI-powered marketing agency. Paste a URL, get a 30-day campaign with professional ad creatives in minutes.",
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
          <nav className="border-b border-border bg-[var(--background)]/80 backdrop-blur-xl sticky top-0 z-50">
            <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-10">
              <div className="flex items-center justify-between h-16">
                <a href="/" className="flex items-center gap-2.5">
                  <div className="w-8 h-8 bg-brand rounded-lg flex items-center justify-center">
                    <svg width="16" height="16" viewBox="0 0 20 20" fill="none" stroke="black" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M1 13l4-8 3 4 4-6 3 4 4-2" />
                      <path d="M15 7l2-1v8" />
                      <circle cx="17" cy="6" r="2.5" />
                    </svg>
                  </div>
                  <span className="text-[15px] font-semibold tracking-tight text-foreground">
                    TheMarketer
                  </span>
                </a>
                <div className="flex items-center gap-4">
                  <a
                    href="/saved"
                    className="text-[13px] text-muted hover:text-foreground transition-colors"
                  >
                    Saved Plans
                  </a>
                  <div className="h-4 w-px bg-border" />
                  <ThemeToggle />
                  <div className="h-4 w-px bg-border" />
                  <span className="text-[11px] text-brand font-medium uppercase tracking-widest">
                    Premium AI Agent
                  </span>
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
