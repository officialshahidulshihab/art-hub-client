import { Instrument_Serif, Work_Sans } from "next/font/google";
import "./globals.css";
import Navbar from "@/Components/Navbar";
import { Providers } from "./providers";

const instrumentSerif = Instrument_Serif({
  subsets: ["latin"],
  weight: "400",
  style: ["normal", "italic"],
  variable: "--font-instrument-serif",
});

const workSans = Work_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-work-sans",
});

export const metadata = {
  title: "ArtHub",
  description: "Discover & buy original art",
};

export default function RootLayout({ children }) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${instrumentSerif.variable} ${workSans.variable} h-full antialiased`}
    >
      <body className="bg-background font-sans text-foreground antialiased">
        <Providers>
          <Navbar />
          <main>{children}</main>
        </Providers>
      </body>
    </html>
  );
}