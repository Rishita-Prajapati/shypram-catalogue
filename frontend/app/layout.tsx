import type React from "react"
import type { Metadata } from "next"
import { GeistSans } from "geist/font/sans"
import { GeistMono } from "geist/font/mono"
import { ThemeProvider } from "@/components/theme-provider"
import "./globals.css"

export const metadata: Metadata = {
  title: "Shypram Rubber Profiles - Product Catalogue",
  description:
    "Professional rubber gaskets and sealing solutions for industrial, automotive, and commercial applications",
  generator: "v0.app",
  icons: {
    icon: "/LOGO.png",
    shortcut: "/LOGO.png",
    apple: "/LOGO.png",
  },
  openGraph: {
    title: "Shypram Rubber Profiles - Product Catalogue",
    description: "Professional rubber gaskets and sealing solutions for industrial, automotive, and commercial applications",
    images: ["/LOGO.png"],
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <style>{`
html {
  font-family: ${GeistSans.style.fontFamily};
  --font-sans: ${GeistSans.variable};
  --font-mono: ${GeistMono.variable};
}
        `}</style>
      </head>
      <body className="">
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem={true} disableTransitionOnChange={false}>
          <div className="relative min-h-screen pt-16">
            {children}
          </div>
        </ThemeProvider>
      </body>
    </html>
  )
}
