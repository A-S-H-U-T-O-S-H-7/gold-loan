import { Inter, Playfair_Display, JetBrains_Mono } from "next/font/google";
import "./globals.css";

// ============================================
// FONTS - Gold Loan CRM
// ============================================
const inter = Inter({
  variable: "--font-sans",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

const playfair = Playfair_Display({
  variable: "--font-serif",
  subsets: ["latin"],
  weight: ["400", "600", "700"],
});

const jetbrains = JetBrains_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
  weight: ["400", "600"],
});

export const metadata = {
  title: "ATD Gold Loan",
  description: "Gold loan origination, collections and vault operations",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
        className={`${inter.variable} ${playfair.variable} ${jetbrains.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}