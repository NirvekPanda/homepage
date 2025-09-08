import { Montserrat } from "next/font/google";
import "./globals.css";
import Header from "./components/header";
import BackgroundProvider from "./components/BackgroundProvider";

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
        className={`${montserrat.variable} font-montserrat antialiased min-h-dvh`}
      >
        <BackgroundProvider>
          <Header />
          {children}
        </BackgroundProvider>
      </body>
    </html>
  );
}
