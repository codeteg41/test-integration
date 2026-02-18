import { Ubuntu, Unbounded } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import { ThemeProvider } from "@/components/theme-provider";
import { AuthGate } from "@/components/auth-gate";
import "./globals.css";
const _ubuntu = Ubuntu({
    subsets: ["latin"],
    weight: ["300", "400", "500", "700"],
    variable: "--font-ubuntu",
});
const _unbounded = Unbounded({
    subsets: ["latin"],
    weight: ["300", "400", "500", "600", "700"],
    variable: "--font-unbounded",
});
export const metadata = {
    title: "PulsAI - Dashboard CRM Intelligent",
    description: "PulsAI est une plateforme CRM intelligente combinant IA conversationnelle, gestion de tickets et automatisation marketing.",
};
export default function RootLayout({ children, }) {
    return (<html lang="fr" suppressHydrationWarning>
      <body className={`${_ubuntu.variable} ${_unbounded.variable} font-sans antialiased`}>
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem={false}>
          <AuthGate>{children}</AuthGate>
        </ThemeProvider>
        <Analytics />
      </body>
    </html>);
}
