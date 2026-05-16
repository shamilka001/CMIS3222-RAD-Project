import "./globals.css"
import { Geist } from "next/font/google";
import { cn } from "@/lib/utils";

const geist = Geist({subsets:['latin'],variable:'--font-sans'});

export const metadata = {
  title: "MaxLight Cinema",
  description: "Experience Cinema",
}

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={cn("font-sans", geist.variable)}>
      <body className="bg-black text-white antialiased">
        <main>{children}</main>
        {/* If you have a mobile dock, only keep it if it's necessary */}
      </body>
    </html>
  )
}