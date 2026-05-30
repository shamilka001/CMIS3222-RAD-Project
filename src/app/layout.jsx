import { SettingsProvider } from "@/context/SettingsContext"
import "@/app/globals.css" // Your tailwind paths

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <SettingsProvider>
          {children}
        </SettingsProvider>
      </body>
    </html>
  )
}