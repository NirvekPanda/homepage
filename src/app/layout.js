import { Montserrat } from "next/font/google";
import "./globals.css";
import Header from "./components/header";

const montserrat = Montserrat({
  variable: "--font-montserrat",
  subsets: ["latin"],
  weight: ["400", "600", "700"],
  display: "swap",
});

export const metadata = {
  title: "Meet Nirvek",
  description: "Introducing Nirvek Pandey",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
        className={`${montserrat.variable} font-montserrat antialiased bg-gradient-to-b from-stone-900 to-neutral-700`}
      >
        <Header />
        {children}
      </body>
    </html>
  );
}
