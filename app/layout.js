import { Urbanist } from "next/font/google";
import { Inter } from "next/font/google";
import { Sedan } from "next/font/google";
import "./globals.css";
import "./dashboard.css";
import "./signup.css";
import "./home.css";
import "./webapp.css";
import "../icofont/icofont.min.css"

import { ClerkProvider } from "@clerk/nextjs";


const inter = Inter({subsets: ["latin"], weight: ['100', '300', '400', '500', '800', '700', '900'], variable: "--font-i"})
const urb = Urbanist({subsets: ["latin"], weight: ['100', '300', '400', '500', '800', '700'], variable: "--font-u"})
const sed = Sedan({subsets: ["latin"], weight: [ '400' ], variable: "--font-s"})



export const metadata = {
  title: 'Volara',
  description: "Welcome to Volara Hocreate",
}

export default function RootLayout({ children }) {
    return (
      <ClerkProvider>
        <html lang="en">
          <body className={`${urb.variable} ${inter.variable} ${sed.variable}`}>{children}</body>
        </html>
      </ClerkProvider>
    );
}
