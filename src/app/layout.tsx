import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/providers/theme-provider";
import { Toaster } from "@/components/ui/toaster"
import { ClerkProvider } from "@clerk/nextjs";
import TawkToChat from "@/components/site/JivoChat";



const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"], // Add the weights you need
  variable: "--font-poppins", // Optional: for using as a CSS variable
});

export const metadata: Metadata = {
  title: "Sphera Vault",
  description: "Best Trading Platfrom across the globe",
  icons: {
    icon: '/logo.png'
  }
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
  
      <html lang="en">
        <body className={poppins.className}>
          <ThemeProvider
            attribute="class"
            defaultTheme="dark"
            enableSystem
            disableTransitionOnChange
          > 
            {children}
            <TawkToChat/>
            <Toaster />
          </ThemeProvider>
        </body>
      </html>
      </ClerkProvider>

  );
}
