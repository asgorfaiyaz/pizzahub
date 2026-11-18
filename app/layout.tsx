import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ThemeProvider } from "@/components/ui/theme-provider";
import { AppChrome } from "@/components/app-chrome";
import { Toaster } from "@/components/ui/toast";

const nippo = localFont({
  src: "../public/fonts/Nippo-Variable.woff2",
  weight: "200 700",
  variable: "--font-nippo",
  display: "swap",
});

const generalSans = localFont({
  src: "../public/fonts/GeneralSans-Variable.woff2",
  weight: "200 700",
  variable: "--font-general-sans",
  display: "swap",
});

export const metadata: Metadata = {
  title: "PizzaHub",
  description: "Discover local pizza shops and order your next favorite slice.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${nippo.variable} ${generalSans.variable} h-full antialiased font-sans`}
      suppressHydrationWarning
    >
      <body className="flex min-h-svh flex-col">
        <TooltipProvider>
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            <AppChrome>{children}</AppChrome>
            <Toaster />
          </ThemeProvider>
        </TooltipProvider>
      </body>
    </html>
  );
}
